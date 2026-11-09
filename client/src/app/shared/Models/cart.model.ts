import {nanoid} from 'nanoid';

export type CartType = {
    id: string;
    items: CartItem[];
    deliveryMethodId?: number;
    paymentIntentId?: number;
    clientSecret?: string;
    coupon?: CartCoupon | null;
}

export type CartCoupon = {
    name: string;
    amountOff: number | null;
    percentOff: number | null;
    promotionCode: string;
    couponId: string;
}

export type CartItem = {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

export class Cart implements CartType {
    id = nanoid();
    items: CartItem[] = [];
    deliveryMethodId?: number;
    paymentIntentId?: number;
    clientSecret?: string;
    coupon?: CartCoupon | null;
}