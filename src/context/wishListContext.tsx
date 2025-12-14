import React, { createContext, useState, useEffect, useContext } from 'react';

type ID = string | number;

/** Context 內資料的型別 */
export type WishListContextType = {
  wishList: ID[];
  toggleWish: (productId: ID) => void;
};

/** 沒有預設值；若忘記包 Provider，存取時會拋錯（更安全） */
export const wishListContext = createContext<WishListContextType | undefined>(undefined);

type ProviderProps = {
  children: React.ReactNode;
};

export function WishListProvider({ children }: ProviderProps): JSX.Element {
  const [wishList, setWishList] = useState<ID[]>(() => {
    const stored = localStorage.getItem('wishList');
    try {
      return stored ? (JSON.parse(stored) as ID[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishList', JSON.stringify(wishList));
  }, [wishList]);

  const toggleWish = (productId: ID) => {
    setWishList((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <wishListContext.Provider value={{ wishList, toggleWish }}>
      {children}
    </wishListContext.Provider>
  );
}

/**（可選）順手提供一個 hook，避免每頁自己 useContext */
export function useWishList(): WishListContextType {
  const ctx = useContext(wishListContext);
  if (!ctx) throw new Error('useWishList 必須在 <WishListProvider> 內使用');
  return ctx;
}
