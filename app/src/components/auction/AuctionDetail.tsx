import Navbar from "../navbar/Navbar.tsx";
import {useEffect, useState} from "react";
import {type ProductBids, type ProductResponse, productService} from "../../api/productService.ts";
import {useParams} from "react-router-dom";
import "./AuctionDetail.css";
import BidWindow from "./BidWindow.tsx";
import {SaleType, Status} from "../../types/product.ts";
import {formatDate, parseTimeDistance} from "../../utils/formatDate.ts";

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
            .then((data) => setProduct(data));

        productService.getProductBids(Number(productId))
            .then((bids) => setBidsData(bids));
    }, [productId]);

    useEffect(() => {
        if (!productId) return;

        const wsUrl = `${import.meta.env.VITE_WS_URL}/auctions/${productId}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("Připojeno k live aukci:", productId);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'NEW_BID') {
                const newBid: ProductBids = data.payload;

                setBidsData((prevBids) => {
                    const updatedBids = [newBid, ...prevBids];
                    return updatedBids.sort((a, b) => b.amount - a.amount);
                });
            }

            // TODO: přidat i event na změnu stavu aukce (např. "AUCTION_ENDED")
            //if (data.type === 'AUCTION_ENDED') {
            //    setProduct(prev => prev ? { ...prev, status: Status.Ended } : null);
            //}
        };

        ws.onclose = () => {
            console.log("Odpojeno od live aukce");
        };

        return () => {
            ws.close();
        };
    }, [productId]);

    const calculateTimeLeft = (bid_time: string) => {
        if (!product.ends_at) return;

        const bidTime = new Date(bid_time).getTime();
        const now = new Date().getTime();
        const distance = now - bidTime;

        const { days, hours, minutes } = parseTimeDistance(distance);

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
                    <h3>POPIS AUKCE</h3>
                    <div>Autor aukce: {product.group.name}</div>
                    <div>Založeno: {formatDate(product.starts_at)}</div>
                    <div className="auction-description">{product.description}</div>
                </div>
                <div className="bids-history-container">
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                        <h3>HISTORIE PŘÍHOZŮ</h3>
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