import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Change } from "../common/UI";
import { money, movement } from "../../utils/format";
export default function CropCard({ crop, price, market }) {
  return (
    <Link className="crop-card" to={"/farmer/prices/" + crop.id}>
      <div className="crop-card-top">
        <img src={crop.image || "/images/rice.jpg"} alt="" />
        <ArrowUpRight size={19} className="muted" />
      </div>
      <h3>{crop.name}</h3>
      <p className="crop-market">{market?.name || "No verified market"}</p>
      <div className="crop-price">
        {price ? money(price.price) : "No price"}
        <span>{price ? "/kg" : ""}</span>
      </div>
      {price ? (
        <Change value={movement(price.price, price.previous)} />
      ) : (
        <span className="muted">Awaiting validated data</span>
      )}
    </Link>
  );
}
