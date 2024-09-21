import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Home() {
  const [foodCat, setFoodCat] = useState([]); // Initialize as an empty array
  const [foodItems, setFoodItems] = useState([]); // Initialize as an empty array
  const [search, setSearch] = useState('');

  const loadFoodItems = async () => {
    try {
      let response = await fetch("https://tomatomernappbackend.onrender.com/api/foodData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setFoodItems(data[0]);
      setFoodCat(data[1]);
    } catch (error) {
      console.error("Error loading food items:", error);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, []);

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
        {Array.isArray(foodCat) && foodCat.length > 0 ? foodCat.map((data) => (
          <div key={data.id} className='row mb-3'>
            <div className='fs-3 m-3'>
              {data.CategoryName}
            </div>
            <hr id="hr-success" style={{ height: "4px", backgroundImage: "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))" }} />
            {Array.isArray(foodItems) && foodItems.length > 0 ? foodItems.filter(
              (item) => (item.CategoryName === data.CategoryName) && (item.name.toLowerCase().includes(search.toLowerCase()))
            ).map(filterItems => (
              <div key={filterItems.id} className='col-12 col-md-6 col-lg-3'>
                <Card foodName={filterItems.name} item={filterItems} options={filterItems.options[0]} ImgSrc={filterItems.img} />
              </div>
            )) : <div>No Such Data</div>}
          </div>
        )) : ""}
      </div>
      <Footer />
    </div>
  );
}
