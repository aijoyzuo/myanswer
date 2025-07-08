import { useContext } from 'react';
import { WishListContext } from '../context/wishListContext';


const useWishList = () => useContext(WishListContext);

export default useWishList;