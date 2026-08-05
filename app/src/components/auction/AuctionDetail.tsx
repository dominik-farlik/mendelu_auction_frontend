import Navbar from "../navbar/Navbar.tsx";
import {useEffect, useState} from "react";
import {type ProductBids, type ProductResponse, productService} from "../../api/productService.ts";
import {useParams} from "react-router-dom";
import "./AuctionDetail.css";
import BidWindow from "./BidWindow.tsx";
import {SaleType, Status} from "../../types/product.ts";
import {formatDate} from "../../utils/formatDate.ts";

export default function AuctionDetail() {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<ProductResponse>({
        id: Number(productId),
        big_preview: false,
        buy_now_price: 0,
        cover_image: "",
        created_at: "",
        created_by_id: 0,
        ends_at: "",
        images: [],
        sale_type: SaleType.Auction,
        starting_price: 0,
        starts_at: "",
        status: Status.Pending,
        title: "",
        description: "",
        group: {
            name: "",
            organization: "",
        }
    })
    const [bidsData, setBidsData] = useState<ProductBids[]>([]);
    useEffect(() => {
        productService.getProductDetail(Number(productId))
            .then((product) => setProduct(product))
    }, [productId])

    useEffect(() => {
        productService.getProductBids(product.id)
            .then((bids) => {
                setBidsData(bids)
            })
    }, [product]);

    const calculateTimeLeft = (bid_time: string) => {
        if (!product.ends_at) return;

        const bidTime = new Date(bid_time).getTime();
        const now = new Date().getTime();
        const distance = now - bidTime;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 1) {
            return `před ${days} dny`
        } else if (days > 0) {
            return `před ${days} dnem`
        } else if (hours > 1) {
            return `před ${hours} hodinami`
        } else if (hours > 0) {
            return `před ${hours} hodinou`
        } else if (minutes > 1) {
            return `před ${minutes} minutami`
        } else if (minutes > 0) {
            return `před ${minutes} minutou`
        } else {
            return "před několika sekundami"
        }
    };

    return (
        <div className="page">
            <div className="hero" style={{ backgroundColor: "var(--mendelu-pef-color-dark)", color: "white" }}>
                <Navbar />
                <div className="auction-detail-container">
                    <div className="auction-detail-info-container">
                        <span className="auction-detail-title">{product.title}</span>
                        <span className="">Výtěžek aukce obdrží: {product.group.organization}</span>
                        <BidWindow product={product} bidsData={bidsData}/>
                    </div>
                    <div className="auction-detail-image-container">
                        <img src={`${import.meta.env.VITE_IMAGES_URL}/${product.cover_image}`} alt="Hlavní obrázek nabídky"/>
                        <div className="auction-detail-galery">
                            {product.images.map((image, index) => (
                                <img key={index} src={`${import.meta.env.VITE_IMAGES_URL}/${image.filename}`}  alt="Malý náhled produktu"/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="auction-detail-container">
                <div className="description-container">
                    <div className="user-page-title">POPIS AUKCE</div>
                    <div>Autor aukce: {product.group.name}</div>
                    <div>Založeno: {formatDate(product.starts_at)}</div>
                    <div>{product.description}</div>
                </div>
                <div className="bids-history-container">
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                        <div className="user-page-title">HISTORIE PŘÍHOZŮ</div>
                        <div>({bidsData?.length || 0})</div>
                    </div>
                    <div className="bids-history-container">
                        {bidsData.map((bid, index) => (
                            <div key={index} className="bids-history-row">
                                <div style={{ display: "flex" }}>
                                    <div>{bid.bidder.first_name}</div>
                                    <div className="gray-italic-text">, {calculateTimeLeft(bid.bid_time)}</div>
                                </div>
                                <div className="bold-text">{bid.amount} Kč</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}