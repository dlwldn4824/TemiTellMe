import "../styles/photo.css";
import { useNavigate } from "react-router-dom";
import { emitButtonClick, emitPageNavigation } from "../api/temiApi";

export default function Photo(){
  const nav = useNavigate();

  const handlePhotoYes = () => {
    emitButtonClick("photo_yes_button");
    emitPageNavigation("photo", "photo/filter");
    nav("/photo/filter");
  };

  const handlePhotoNo = () => {
    emitButtonClick("photo_no_button");
    emitPageNavigation("photo", "home");
    nav("/");
  };

  return (
    <main className="photo-page">
      <section className="photo-stage" />
      <img
        src={"/assets/quiz/quiz_yes_btn.svg"}
        alt="촬영할래요!"
        className="photo-btn photo-btn-yes"
        onClick={handlePhotoYes}
      />
      <img
        src={"/assets/quiz/quiz_no_btn.svg"}
        alt="괜찮아요"
        className="photo-btn photo-btn-no"
        onClick={handlePhotoNo}
      />
    </main>
  );
}
