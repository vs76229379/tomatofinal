import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Home() {
    const [search, setSearch] = useState('');
    const [foodCat, setFoodCat] = useState([]);
    const [foodItem, setFoodItem] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    const loadData = async () => {
        try {
            let response = await fetch("https://tomatomernappbackend.onrender.com/api/foodData", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            setFoodItem(data[0]);
            setFoodCat(data[1]);
            setLoading(false); // Set loading to false once data is fetched
        } catch (error) {
            console.error('Error fetching food data:', error);
            setLoading(false); // Set loading to false in case of error
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Display loading state
    }

    return (
        <div>
            <div><Navbar /></div>
            <div>
                <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{ objectFit: "contain !important" }}>
                    <div className="carousel-inner" id="carousel">
                        <div className="carousel-caption" style={{ zIndex: "10" }}>
                            <div className="d-flex justify-content-center">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="carousel-item active">
                            <img src="https://source.unsplash.com/random/900x700/?burger" className="d-block w-100" style={{ filter: "brightness(30%)" }} alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img src="https://source.unsplash.com/random/900x700/?pizza" className="d-block w-100" style={{ filter: "brightness(30%)" }} alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img src="https://source.unsplash.com/random/900x700/?momos" className="d-block w-100" style={{ filter: "brightness(30%)" }} alt="..." />
                        </div>
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
            </div>

            <div className='container'>
                {foodCat.length > 0 ? (
                    foodCat.map((data) => (
                        <div className='row mb-3' key={data._id}>
                            <div className="fs-3 m-3">
                                {data.CategoryName}
                            </div>
                            <hr />
                            {foodItem.length > 0 ? (
                                foodItem
                                    .filter(item => item.CategoryName === data.CategoryName && item.name.toLowerCase().includes(search.toLowerCase()))
                                    .map(filterItems => (
                                        <div key={filterItems._id} className="col-12 col-md-6 col-lg-3">
                                            <Card foodItem={filterItems} options={filterItems.options[0]} />
                                        </div>
                                    ))
                            ) : (
                                <div>No such Data Found</div>
                            )}
                        </div>
                    ))
                ) : (
                    <div>No categories found.</div>
                )}
            </div>

            <div><Footer /></div>
        </div>
    );
}
