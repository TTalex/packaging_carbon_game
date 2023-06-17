
const Product = (props) => {
    if(!props.product) {
        return (<div></div>)
    }
    return (
        <div className="card">
            <div className="card-image">
                <figure style={{textAlign: "center"}}>
                    <img src={props.product.image_url} alt={props.product.product_name} style={{height: "200px"}} />
                </figure>
            </div>
            <div className="card-content">
                <div className="media">
                    <div className="media-content">
                        <p className="title">{props.product.product_name}</p>
                        {!props.showResult && <button className="button is-primary" onClick={props.onClick}>Celui-ci est le pire</button>}
                        {props.showResult && <div>
                            <p className="subtitle">{Math.round(props.product.gCO2e)} gCO2e</p>
                            <div>Matières:</div>
                            <div className="tags">
                                {props.product.materials.split(",").map(material => <span className="tag">{material}</span>)}
                            </div>
                            <p style={{marginTop: "10px"}}><a target="_blank" href={`https://fr.openfoodfacts.org/produit/${props.product.code}`}>{`https://fr.openfoodfacts.org/produit/${props.product.code}`}</a></p>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
const App = () => {
    const [data, setData] = React.useState({})
    const [showResult, setShowResult] = React.useState(false)
    const [showErrorNotif, setShowErrorNotif] = React.useState(false)
    const [showSuccessNotif, setShowSuccessNotif] = React.useState(false)
    const [correctProduct, setCorrectProduct] = React.useState("")
    React.useEffect(() => {
        fetchTwo()
    }, [])
    const fetchTwo = () => {
        fetch("/api/fetchTwo")
        .then(res => res.json())
        .then(res => {
            console.log(res)
            setData(res)
        })
    }
    const handleClick = (product) => {
        setShowResult(true)
        let correctProduct
        if (data.product1.gCO2e === data.product2.gCO2e) {
            setCorrectProduct(data.product1)
            setShowSuccessNotif(true)
            return
        }
        if (data.product1.gCO2e > data.product2.gCO2e) {
            correctProduct = data.product1
        } else {
            correctProduct = data.product2
        }
        setCorrectProduct(correctProduct)
        if (product.code === correctProduct.code) {
            setShowSuccessNotif(true)
        } else {
            setShowErrorNotif(true)
        }
    }
    const replay = () => {
        fetchTwo()
        setShowResult(false)
        setShowErrorNotif(false)
        setShowSuccessNotif(false)
        setCorrectProduct("")
    }
    return (
        <div className="main">
            <section className="section">
                <div className="container">
                    <h1 className="title">
                        Devinez quel emballage a le pire impact carbone
                    </h1>
                    {showErrorNotif && <div className="notification is-danger" onClick={e => replay()} style={{cursor: "pointer"}}>
                        Raté, la bonne réponse était {correctProduct.product_name}, cliquez sur ce bandeau pour rejouer.
                    </div>}
                    {showSuccessNotif && <div className="notification is-success" onClick={e => replay()} style={{cursor: "pointer"}}>
                        Bravo, la bonne réponse est bien {correctProduct.product_name}, cliquez sur ce bandeau pour rejouer.
                    </div>}
                    <div className="columns">
                        <div className="column"></div>
                        <div className="column is-4">
                            <Product product={data.product1} onClick={e => handleClick(data.product1)} showResult={showResult}></Product>
                        </div>
                        <div className="column is-4">
                            <Product product={data.product2} onClick={e => handleClick(data.product2)} showResult={showResult}></Product>
                        </div>
                        <div className="column"></div>
                    </div>                    
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <h2 className="title">
                        Quelques notes
                    </h2>
                    <p>
                        Si une partie du contenu ne charge pas, les serveurs d'Open Food Facts sont probablement saturés, retentez plus tard. 
                    </p>
                    <br/>
                    <p>
                        Ce site utilise l'équivalent CO2 comme valeur de comparaison.
                    </p>
                    <p>
                        Cette unité de mesure est habituelle dans les calculs d'impacts écologiques, mais donne aussi une vision biaisée de certains résultats. En particulier en comparant des matériaux entre eux.
                    </p>
                    <p>
                        Par exemple, alors que le verre a un impact par kg moins important que le plastique, il faut nettement plus de verre pour contenir une contenance similaire. Les bouteilles en verre apparaissent alors comme les plus néfastes pour l'environnement.
                    </p>
                    <p>
                        Ce que le CO2e ne prend pas en compte sont la rareté des ressources primaires (pétrole), les conséquences sociales, la pollution de l'air (sub-atmosphérique, particules fines) et la pollution des déchets ayant échappé aux systèmes de traitements (microplastiques, vortex de déchets...).
                    </p>
                    <p>
                        Il est aussi intéressant de noter que certains matériaux comme le liège ont un impact positif en CO2e, alors qu'ils restent source de déchets. Une bouteille de vin avec un bouchon de liège peut alors avoir une empreinte carbone nulle, malgré l'usage d'autres matériaux.
                    </p>
                    <br/>
                    <p>
                        Les données et images proviennent d'<a href="https://fr.openfoodfacts.org/">Open Food Facts</a>, la base de données de produits alimentaires collaborative. Ces informations sur le poids et composition des emballages est ensuite multiplié par des facteurs d'émissions provenant de diverses sources. Le tableau ci-dessous reprend ces facteurs et sources.
                    </p>
                    <br/>
                    <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                        <thead>
                            <tr>
                                <th>Material</th>
                                <th>kg CO2e per Kg of material</th>
                                <th>Source</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><span className="tag">en:pp-5-polypropylene</span></td><td>2</td><td><a target="_blank" href="https://www.ecoconso.be/fr/content/moins-de-plastique-pour-moins-de-co2">[1]</a></td></tr>
                            <tr><td><span className="tag">en:other-paper</span></td><td>0.45</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:pe-7-polyethylene</span></td><td>3.4</td><td><a target="_blank" href="https://www.ecoconso.be/fr/content/moins-de-plastique-pour-moins-de-co2">[1]</a></td></tr>
                            <tr><td><span className="tag">en:paper</span></td><td>0.45</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:plastic</span></td><td>1.8</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:pet-1-polyethylene-terephthalate</span></td><td>3.27</td><td><a target="_blank" href="https://www.ecoconso.be/fr/content/moins-de-plastique-pour-moins-de-co2">[1]</a></td></tr>
                            <tr><td><span className="tag">en:non-corrugated-cardboard</span></td><td>0.558</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:glass</span></td><td>0.689</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:steel</span></td><td>1.695</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:aluminium</span></td><td>3.458</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:cardboard</span></td><td>0.558</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:hdpe-2-high-density-polyethylene</span></td><td>1.92</td><td><a target="_blank" href="https://www.ecoconso.be/fr/content/moins-de-plastique-pour-moins-de-co2">[1]</a></td></tr>
                            <tr><td><span className="tag">en:ldpe-4-low-density-polyethylene</span></td><td>2.09</td><td><a target="_blank" href="https://www.ecoconso.be/fr/content/moins-de-plastique-pour-moins-de-co2">[1]</a></td></tr>
                            <tr><td><span className="tag">en:metal</span></td><td>3.458</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:ps-6-polystyrene</span></td><td>2.83</td><td><a target="_blank" href="https://www.ecoconso.be/fr/content/moins-de-plastique-pour-moins-de-co2">[1]</a></td></tr>
                            <tr><td><span className="tag">en:corrugated-cardboard</span></td><td>0.558</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:eps-expanded-polystyrene</span></td><td>2.83</td><td><a target="_blank" href="https://www.ecoconso.be/fr/content/moins-de-plastique-pour-moins-de-co2">[1]</a></td></tr>
                            <tr><td><span className="tag">en:pvc-3-polyvinyl-chloride</span></td><td>1.627</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:wood</span></td><td>0.129</td><td><a target="_blank" href="https://www.emballage-leger-bois.fr/node/19">[3]</a></td></tr>
                            <tr><td><span className="tag">en:o-7-other-plastics</span></td><td>1.627</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:pa-polyamide</span></td><td>1.8</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:cellulose</span></td><td>1.627</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:cork</span></td><td>-73.3</td><td><a target="_blank" href="https://thisiscertifiedsustainable.wine/wp-content/uploads/2022/01/Cork_CO2_85x11_APCOR.pdf">[4]</a></td></tr>
                            <tr><td><span className="tag">en:cellophane</span></td><td>1.627</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:clear-glass</span></td><td>0.689</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:n2-azote</span></td><td>0</td><td>gas</td></tr>
                            <tr><td><span className="tag">en:cotton</span></td><td>54</td><td><a target="_blank" href="https://www.franceindustrie.org/wp-franceindustrie/wp-content/uploads/2021/02/Synthese-Etude-UIT-Empreinte-carbone-280121.pdf">[5]</a></td></tr>
                            <tr><td><span className="tag">en:other-textiles</span></td><td>54</td><td><a target="_blank" href="https://www.franceindustrie.org/wp-franceindustrie/wp-content/uploads/2021/02/Synthese-Etude-UIT-Empreinte-carbone-280121.pdf">[5]</a></td></tr>
                            <tr><td><span className="tag">en:brown-glass</span></td><td>0.689</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:fsc-cardboard</span></td><td>0.558</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                            <tr><td><span className="tag">en:paper-and-plastic</span></td><td>1.125</td><td><a target="_blank" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQs-ppy9LXk0cMo2s2mtxHBjpI9pgTFzTcivo06uj5_uKIgkBwCBIXVYI-Ngyb1AsT9JQsz3ExO6EF-/pubhtml">[2]</a></td></tr>
                        </tbody>
                        </table>
                    <p>
                        Note importante : les calculs d'<a href="https://expertises.ademe.fr/economie-circulaire/consommer-autrement/passer-a-laction/dossier/lanalyse-cycle-vie/quest-lacv">analyses de cycles de vie</a> des matières sont très complexes. Réduire ces informations à une simple constante n'est pas considéré comme une bonne pratique. Ces données sont donc uniquement présentées à titre indicatif et ne doivent pas être réutilisées sans vérification et confirmation par un expert. 
                    </p>
                </div>
            </section>
        </div>
    )
}

const domContainer = document.getElementById('root');
ReactDOM.render(<App />, domContainer);
