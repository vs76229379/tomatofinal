import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Home() {
  const [foodCat, setFoodCat] = useState([]); // Categories
  const [foodItems, setFoodItems] = useState([]); // Food items
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  const loadFoodItems = async () => {
    try {
      let response = await fetch("https://tomatomernappbackend.onrender.com/api/foodData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("API Response:", data); // Log response structure

      // Ensure data structure is valid
      if (!data || data.length < 2 || !Array.isArray(data[0]) || !Array.isArray(data[1])) {
        console.error("Invalid data received from API");
        setFoodItems([]);
        setFoodCat([]);
        return;
      }

      setFoodItems(data[0]); // Food items array
      setFoodCat(data[1]); // Categories array
    } catch (error) {
      console.error("Error loading food items:", error);
    } finally {
      setLoading(false); // End loading state
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  return (
    <div>
      <Navbar />
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner" id='carousel'>
          <div className="carousel-caption" style={{ zIndex: "9" }}>
            <div className="d-flex justify-content-center">
              <input
                className="form-control me-2 w-75 bg-white text-dark"
                type="search"
                placeholder="Search in here..."
                aria-label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn text-white bg-danger" onClick={() => setSearch('')}>X</button>
            </div>
          </div>
          {["burger", "pastry", "barbeque"].map((item, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={item}>
              <img src={`https://source.unsplash.com/random/900x700/?${item}`} className="d-block w-100" style={{ filter: "brightness(30%)" }} alt={`Delicious ${item}`} />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className='container'>
        {foodCat.length > 0 ? (
          foodCat.map((category) => (
            <div key={category._id} className='row mb-3'>
              <div className='fs-3 m-3'>{category.CategoryName}</div>
              <hr />
              {foodItems.length > 0 ? (
                foodItems
                  .filter(item => item.CategoryName === category.CategoryName && item.name.toLowerCase().includes(search.toLowerCase()))
                  .map(filteredItem => (
                    <div key={filteredItem._id} className='col-12 col-md-6 col-lg-3'>
                      <Card
                        foodName={filteredItem.name}
                        item={filteredItem}
                        options={filteredItem.options[0]}
                        ImgSrc={filteredItem.img}
                      />
                    </div>
                  ))
              ) : (
                <div>No Food Items Available</div>
              )}
            </div>
          ))
        ) : (
          <div>No Categories Available</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
