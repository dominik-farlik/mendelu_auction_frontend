import Navbar from "../navbar/Navbar.tsx";
import {useEffect, useState} from "react";
import {type ProductBids, type ProductResponse, productService} from "../../api/productService.ts";
import {useParams} from "react-router-dom";
import "./AuctionDetail.css";
import BidWindow from "./BidWindow.tsx";
import {SaleType, Status} from "../../types/product.ts";

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
                    <div>Popis</div>
                    <div>{product.description}</div>
                </div>
                <div>
                    <div>Historie příhozů ({bidsData?.length || 0})</div>
                    <div>
                        {bidsData.map((bid, index) => (
                            <div key={index}>{bid.bidder.first_name} {bid.bidder.last_name}, {bid.bid_time} {bid.amount} Kč</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}