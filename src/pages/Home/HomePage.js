import HeroSection from "../../components/Home/HeroSection";
import BikeGrid from "../../components/Home/BikeGrid";
import Features from "../../components/Home/Features";
import Footer from "../../components/Footer/Footer";
import Notification from "../../components/Home/Notification"
import "./HomePage.css";

const HomePage = () => {
    return (
        <div>
            <HeroSection />
            <BikeGrid />
            <Features />
            <Footer />
            {<Notification />}
        </div>
       )
}
export default HomePage;
