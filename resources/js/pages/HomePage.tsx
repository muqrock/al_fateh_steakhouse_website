import React from "react";

export default function HomePage() {
  return (
    <div style={{
      backgroundImage: "url('/images/steak.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      color: "white",
      display: "flex",
      flexDirection: "column"
    }}>
      <nav style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "20px",
        padding: "20px"
      }}>
        <a href="/">Home</a>
        <a href="/menu">Menu</a>
        <a href="/reservation">Reservation</a>
        <a href="/review">Review</a>
        <a href="/about">About</a>
        <a href="#">🛒</a>
        <a href="#">👤</a>
      </nav>

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
      }}>
        <h1>Al-Fateh Steakhouse</h1>
        <p>The best in Tanjong Malim</p>
        <button style={{
          background: "orange",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "1rem",
          borderRadius: "5px"
        }}>Order Now!</button>
      </div>
    </div>
  );
}
