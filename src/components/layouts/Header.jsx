import Logo from "../ui/Logo";
import ThemeButton from "../buttons/ThemeButton";
import TextSizeButton from "../buttons/TextSizeButton";

const Header = () => {
    return (
        <header className="mx-2">
            <div className="flex justify-between">
                <Logo />
                <div className="flex flex-col space-y-2">
                    <ThemeButton />
                    <TextSizeButton />
                </div>
            </div>
        </header>
    );
};

export default Header;
