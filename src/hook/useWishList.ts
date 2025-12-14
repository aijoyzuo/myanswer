import { useContext } from 'react';
import { wishListContext } from '../context/wishListContext';
import type { WishListContextType } from '../context/wishListContext'; 

export default function useWishList(): WishListContextType {
  return useContext(wishListContext);
}
