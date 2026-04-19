import Card from "./components/layouts/Card";
import Container from "./components/layouts/Container";
import ThemeContextProvider from "./context/ThemeContext";
import BackToTopButton from "./components/ui/BackToTopButton";
import QuizContextProvider from "./context/QuizContext";
import QuizModal from "./components/quiz/QuizModal";
import { useQuizContext } from "./context/QuizContext";
import FavoritesContextProvider from "./context/FavoritesContext";
import FavoritesModal from "./components/favorites/FavoritesModal";
import RootSearchContextProvider from "./context/RootSearchContext";
import { useRootSearchContext } from "./context/RootSearchContext";
import RootSearchModal from "./components/rootsearch/RootSearchModal";

// Component to render the QuizModal with access to context
const QuizModalContainer = () => {
  const { isQuizOpen, closeQuiz } = useQuizContext();
  return <QuizModal isOpen={isQuizOpen} onClose={closeQuiz} />;
};

// Component to render the RootSearchModal with access to context
const RootSearchModalContainer = () => {
  const { isRootSearchOpen, closeRootSearch } = useRootSearchContext();
  return <RootSearchModal isOpen={isRootSearchOpen} onClose={closeRootSearch} />;
};

const App = () => {
  return (
    <ThemeContextProvider>
      <QuizContextProvider>
        <FavoritesContextProvider>
          <RootSearchContextProvider>
          <Container>
            <Card></Card>
          </Container>
          <BackToTopButton />
          <QuizModalContainer />
          <FavoritesModal />
          <RootSearchModalContainer />
          </RootSearchContextProvider>
        </FavoritesContextProvider>
      </QuizContextProvider>
    </ThemeContextProvider>
  );
};

export default App;
