import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import ServicePart from "../../components/ServicePart";

export default function Services() {
  const [isLoading, setIsLoading] = useState(false);
  const serviceItem = [
    {
      img: "https://images.plurk.com/1UPrQWTyyrB6I5IJTPmUjb.png ",
      alt: "",
      name: "深層清潔護理",
      description: "透過溫和去角質、毛孔清潔與粉刺代謝方法，恢復肌膚潔淨與呼吸力。",
      suitableFor: "毛孔粗大、粉刺痘痘困擾、出油肌膚"
    },
    {
      img: "https://images.plurk.com/4n4wKLLNRga9oNFLO5ERkH.png",
      alt: "",
      name: "水光補水療程",
      description: "導入高濃度玻尿酸與保濕因子，強化肌膚鎖水力，提升光澤彈性。",
      suitableFor: "乾燥缺水、暗沉無光、上妝不服貼者"
    },
    {
      img: "https://images.plurk.com/3ezLqmBwKX9EQQDuTi6q5B.png",
      alt: "",
      name: "胜肽抗老拉提",
      description: "結合多重胜肽與緊緻成分，深層滋養、提升肌膚彈性與輪廓線條。",
      suitableFor: "鬆弛老化、細紋明顯、想延緩老化者"
    },
    {
      img: "https://images.plurk.com/5ws0rOSp79pclU0Jdf7UuF.png",
      alt: "",
      name: "舒敏修護護理",
      description: "以低敏配方與舒緩成分強化肌膚屏障，減緩泛紅、刺癢等不適反應。",
      suitableFor: "敏感肌、乾癢脫屑、肌膚容易泛紅者"
    },
    {
      img: "https://images.plurk.com/5p9Kj3PNKvAP3C9krqHPBm.png",
      alt: "",
      name: "亮白煥膚療程",
      description: "添加維他命C與美白因子，改善黯沉膚色與斑點，均勻明亮膚色。",
      suitableFor: "膚色不均、色斑困擾、缺乏光澤者"
    },
    {
      img: "https://images.plurk.com/2rs9ggLA42NYncebdS2mkZ.png",
      alt: "",
      name: "緊緻V臉導入",
      description: "運用微電流或射頻技術，加速精華吸收並雕塑V臉輪廓。",
      suitableFor: "臉部輪廓鬆弛、想改善雙下巴與法令紋者"
    },
    {
      img: "https://images.plurk.com/1XSOGt9nZppNt9f2LWZcM9.png",
      alt: "",
      name: "青春痘調理療程",
      description: "深層清潔配合控油舒緩成分，有效緩解發炎、粉刺與痘痘問題。",
      suitableFor: "青春期與成人痘困擾、油性與混合性肌膚者"
    },
    {
      img: "https://images.plurk.com/HSHNSUAzYTjDwflsm8qLV.png",
      alt: "",
      name: "客製化肌膚管理計畫",
      description: "透過專業膚質檢測與諮詢，量身打造個人化療程組合與保養建議。",
      suitableFor: "想長期改善肌況、尋求整體肌膚升級者"
    }
  ]

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }, []);

  return (<>
    <div className="container my-5">
      <Loading isLoading={isLoading} />
      <h2 className="mb-5 fw-bold">服務項目</h2>
      <div className="row">
        {serviceItem.map((item, index) => (
          <ServicePart
            key={index}
            img={item.img}
            alt={item.alt}
            name={item.name}
            description={item.description}
            suitableFor={item.suitableFor} />
        ))}
      </div>
    </div>
  </>)
}