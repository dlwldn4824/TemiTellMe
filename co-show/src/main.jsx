import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./styles/globals.css";
import RootLayout from "./layout/RootLayout.jsx";
import App from "./App.jsx";
import Guide from "./pages/Guide.jsx";
import Events from "./pages/Events.jsx";
import Photo from "./pages/Photo.jsx";
import ZoneDetailPage from "./pages/ZoneDetailPage.jsx";
import QuickSearch from "./pages/QuickSearch.jsx";
import RecommendList from "./pages/RecommendList.jsx";
import RecommendDetail from "./pages/RecommendDetail.jsx";
import Schedule from "./pages/Schedule.jsx";
import ScheduleDetail from "./pages/ScheduleDetail.jsx";
import Inquiry from "./pages/Inquiry.jsx";
import EventComplete from "./pages/EventComplete.jsx";   
import EventPhone from "./pages/EventPhone.jsx";
import EventFinish from "./pages/EventFinish.jsx";
import Quiz from "./pages/Quiz.jsx";
import PhotoStart from "./pages/PhotoStart.jsx";
import PhotoFilter from "./pages/PhotoFilter.jsx";
import PhotoQr from "./pages/PhotoQr.jsx";   
import TrainNav from "./pages/TrainNav.jsx";
import Inquiry_employee from "./pages/Inquiry_employee";
import Inquiry_justInquiry from "./pages/Inquiry_justInquiry";
import Inquiry_complete from "./pages/InquiryComplete.jsx"
import Inquiry_call from "./pages/Inquiry_call.jsx";
import QuizQuestion from "./pages/QuizQuestion.jsx";
import QuizResult from "./pages/QuizResult.jsx";
import QuizWrong from "./pages/QuizWrong.jsx";
import QuizIntro from "./pages/QuizIntro.jsx";
import Q1 from "./pages/type/Q1";
import Q2 from "./pages/type/Q2";
import Q3 from "./pages/type/Q3";
import TypeResult from "./pages/type/TypeResult";
import TypeTest from "./pages/TypeTest.jsx";
import QuizCorrect from "./pages/QuizCorrect.jsx";
import Recommend from "./pages/RecommendPage.jsx";
import QuickSearchDetail from "./pages/QuickSearchDetail.jsx"
import RouteDemo from "./pages/RouteDemo.jsx";
import TemiGuide from "./pages/TemiGuide.jsx"
import Review from "./pages/Review.jsx";
import Line from "./pages/Line.jsx"

const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <App /> },

      { path: "line", element: <Line /> },
      { path: "guide", element: <Guide /> },
      { path: "schedule", element: <Schedule /> },
      { path: "schedule/detail", element: <ScheduleDetail /> },

      { path: "photo", element: <Photo /> },
      { path: "photo/start", element: <PhotoStart /> },
      { path: "photo/filter", element: <PhotoFilter /> },
      { path: "photo/qr", element: <PhotoQr /> },

      { path: "inquiry", element: <Inquiry /> },
      { path: "inquiry/employee", element: <Inquiry_employee /> },
      { path: "inquiry/justinquiry", element: <Inquiry_justInquiry /> },
      { path: "inquiry/complete", element: <Inquiry_complete /> },
      { path: "inquiry/call", element: <Inquiry_call /> },

      { path: "map", element: <TrainNav /> },
      { path: "map/:zone", element: <ZoneDetailPage /> },

      { path: "search", element: <QuickSearch /> },
      { path: "quick/view", element: <QuickSearchDetail /> },
      { path: "quick/view/guide", element: <TemiGuide/> },

      { path: "recommend", element: <Recommend /> },
      { path: "recommend/result", element: <RecommendList /> },
      { path: "recommend/:id", element: <RecommendDetail /> },

      { path: "quizIntro", element: <QuizIntro /> },
      { path: "quiz", element: <Quiz /> },
      { path: "quiz/:qid", element: <QuizQuestion /> },
      { path: "quiz/:qid/result", element: <QuizResult /> },
      { path: "quiz/:qid/correct", element: <QuizCorrect /> },
      { path: "quiz/:qid/wrong", element: <QuizWrong /> },

      { path: "type-test", element: <TypeTest /> },
      { path: "type/q1", element: <Q1 /> },
      { path: "type/q2", element: <Q2 /> },
      { path: "type/q3", element: <Q3 /> },
      { path: "type/result", element: <TypeResult /> },

      { path: "quiz/events", element: <Events /> },
      { path: "events/complete", element: <EventComplete /> },
      { path: "events/phone", element: <EventPhone /> },
      { path: "events/finish", element: <EventFinish /> },

      { path: "review", element: <Review /> },

      { path: "route-demo", element: <RouteDemo /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="app-center">
      <div className="stage-wrapper">
        <div className="root-fixed" id="app-canvas">
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  </React.StrictMode>
);
