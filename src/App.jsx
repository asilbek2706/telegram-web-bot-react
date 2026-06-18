import "./App.css";
import Card from "./components/card/card";
import Cart from "./components/cart/cart";
import { getData } from "./constants/db";

const courses = getData();

const App = () => {
  return (
    <div className="container">
      <div className="app__header">
        <h1 className="app__title">Asil Kurslar</h1>
      </div>
      <Cart />
      <div className="cards__container">
        {courses.map((course) => (
            <Card key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default App;
