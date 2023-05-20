/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51N9Z7fSGyQLmOHBip4nPbmEdRHR657SjTnbk08SFmYYcBVncvx7e2p9kKXWamzKoNodulEW9wNFKBw7Xhau7VETw00YjlzZlTU');

export const bookTour = async tourId => {
    try {
        // 1) Get checkout session from API
        const session = await axios(
            `/api/v1/bookings/checkout-session/${tourId}`
        );
        // 2) Create checkout form + chanre credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        // console.log(err);
        showAlert('error', err);
    }
};
