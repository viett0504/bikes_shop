import HeroSection from "../../components/Home/HeroSection";
import BikeGrid from "../../components/Home/BikeGrid";
import Features from "../../components/Home/Features";
import Footer from "../../components/Footer/Footer";        
import "./HomePage.css";

const HomePage = () => {
    return (
        <div className="home-page">
            <HeroSection />
            <BikeGrid />
            <Features />
            <Footer />
        </div>
       )
}
export default HomePage;
