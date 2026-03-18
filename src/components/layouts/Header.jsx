import Logo from "../ui/Logo";
import ThemeButton from "../buttons/ThemeButton";
import TextSizeButton from "../buttons/TextSizeButton";
import GrammarButton from "../buttons/GrammarButton";
import { useFavoritesContext } from "../../context/FavoritesContext";

const Header = () => {
    const { openFavorites, favorites } = useFavoritesContext();

    return (
<header style={{ padding: '0px'  }}>
    <div className="dark:bg-black bg-white">
<div className="flex justify-between w-full p-3 px-4 md:p-4 md:px-5 rounded-lg bg-gray-100 dark:bg-gray-900">
                <Logo />
                <GrammarButton />
                <div className="flex items-center gap-2">
                    <button
                        onClick={openFavorites}
                        aria-label="Open favorites"
                        className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-full"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill={favorites.length > 0 ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        {favorites.length > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-pink-600 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none">
                                {favorites.length > 99 ? '99+' : favorites.length}
                            </span>
                        )}
                    </button>
                    <div className="flex flex-col space-y-2">
                        <ThemeButton />
                        <TextSizeButton />
                    </div>
                </div>
            </div></div>
        </header>
    );
};

export default Header;
