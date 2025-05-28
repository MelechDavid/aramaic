import Card from "./components/layouts/Card";
import Container from "./components/layouts/Container";
import ThemeContextProvider from "./context/ThemeContext";
import BackToTopButton from "./components/ui/BackToTopButton";
import QuizContextProvider from "./context/QuizContext";
import QuizModal from "./components/quiz/QuizModal";
import { useQuizContext } from "./context/QuizContext";

// Component to render the QuizModal with access to context
const QuizModalContainer = () => {
  const { isQuizOpen, closeQuiz } = useQuizContext();
  return <QuizModal isOpen={isQuizOpen} onClose={closeQuiz} />;
};

const App = () => {
  return (
    <ThemeContextProvider>
      <QuizContextProvider>
        <Container>
          <Card></Card>
        </Container>
        <BackToTopButton />
        <QuizModalContainer />
      </QuizContextProvider>
    </ThemeContextProvider>
  );
};

export default App;
