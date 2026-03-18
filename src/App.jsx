import Card from "./components/layouts/Card";
import Container from "./components/layouts/Container";
import ThemeContextProvider from "./context/ThemeContext";
import BackToTopButton from "./components/ui/BackToTopButton";
import QuizContextProvider from "./context/QuizContext";
import QuizModal from "./components/quiz/QuizModal";
import { useQuizContext } from "./context/QuizContext";
import FavoritesContextProvider from "./context/FavoritesContext";
import FavoritesModal from "./components/favorites/FavoritesModal";

// Component to render the QuizModal with access to context
const QuizModalContainer = () => {
  const { isQuizOpen, closeQuiz } = useQuizContext();
  return <QuizModal isOpen={isQuizOpen} onClose={closeQuiz} />;
};

const App = () => {
  return (
    <ThemeContextProvider>
      <QuizContextProvider>
        <FavoritesContextProvider>
          <Container>
            <Card></Card>
          </Container>
          <BackToTopButton />
          <QuizModalContainer />
          <FavoritesModal />
        </FavoritesContextProvider>
      </QuizContextProvider>
    </ThemeContextProvider>
  );
};

export default App;
