import { useContext } from 'react';
import { wishListContext } from '../context/wishListContext';


const useWishList = () => useContext(wishListContext);

export default useWishList;