import { useNavigate } from "react-router-dom";


export default function PhotoStart(){
  const nav = useNavigate();

  return (
    <main className="photo-start-page">
      <section className="photo-start-stage" />
    </main>
  );
}
