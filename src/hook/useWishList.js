import { useContext } from 'react';
import { WishListContext } from '../context/WishListContext';


const useWishList = () => useContext(WishListContext);

export default useWishList;