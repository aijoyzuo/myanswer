// WishListContext.js
//這個檔案是「全域資料管理工具」，它負責：儲存收藏清單（wishList 狀態）；提供 toggleWish 函式；將資料透過 Context 供其他元件使用
import { createContext, useState, useContext, useEffect } from 'react';

const WishListContext = createContext();

export const WishListProvider = ({ children }) => {
    const [wishList, setWishList] = useState(() => {
        const stored = localStorage.getItem('wishList');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishList', JSON.stringify(wishList));
    }, [wishList]);

    const toggleWish = (productId) => {
        setWishList((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    return (
        <WishListContext.Provider value={{ wishList, toggleWish }}>
            {children}
        </WishListContext.Provider>
    );
};

export const useWishList = () => useContext(WishListContext);