import { useContext } from 'react';
import { WishListContext } from '../contexts/WishListContext';

const useWishList = () => useContext(WishListContext);

export default useWishList;