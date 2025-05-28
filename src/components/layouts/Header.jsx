import Logo from "../ui/Logo";
import ThemeButton from "../buttons/ThemeButton";
import TextSizeButton from "../buttons/TextSizeButton";
import GrammarButton from "../buttons/GrammarButton";

const Header = () => {
    return (
<header style={{ padding: '0px'  }}>
    <div className="dark:bg-black bg-white">
<div className="flex justify-between w-full p-3 px-4 md:p-4 md:px-5 rounded-lg bg-gray-100 dark:bg-gray-900">
                <Logo />
                <GrammarButton />
                <div className="flex flex-col space-y-2">
                    <ThemeButton />
                    <TextSizeButton />     
                </div>
            </div></div>
        </header>
    );
};

export default Header;
