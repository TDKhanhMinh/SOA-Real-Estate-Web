import Carousel from "../components/Carousel";
import PropertyList from "../components/PropertyList";
import NewsSection from "../components/NewsSection";
import PlaceSection from "../components/PlacesSection";
import SearchForm from "../components/SearchForm";

export default function Home() {
  

    return (
        <div className="pt-20">
            <Carousel />
            <SearchForm />
            <PropertyList/>
            <PlaceSection />
            <NewsSection />
        </div>
    );
}
