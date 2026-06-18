import "./App.css";
import { getData } from "./constants/db";

const courses = getData();

const App = () => {
  return (
    <>
      <h1>Asilbek Kurslar</h1>
      {/* Cards */}
      <div className="cards__container">
        {courses.map((course) => (
          <>
            <h1>{course.title}</h1>
          </>
        ))}
      </div>
    </>
  );
};

export default App;
