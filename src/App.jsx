import Card from "./components/layouts/Card";
import Container from "./components/layouts/Container";
import ThemeContextProvider from "./context/ThemeContext";
import BackToTopButton from "./components/ui/BackToTopButton";

const App = () => {
    return (
        <ThemeContextProvider>
            <Container>
                <Card></Card>
            </Container>
            <BackToTopButton />
        </ThemeContextProvider>
    );
};

export default App;
