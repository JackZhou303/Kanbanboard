import React, { useState, useEffect } from "react";
import Card from "./Card";
import DropWrapper from "./DropWrapper";
import Col from "./Col";
import {categories} from "../data";
import { ServiceApi } from '../service';


const Board = () => {

    const [items, setItems] = useState([]);

    useEffect(() => {
        async function fetchData() {
 
        if(items.length===0){
            const all_cards= await ServiceApi.get_all_data();
            setItems(all_cards);
        }
    }
    fetchData();
      });

    const onDrop = async (item, monitor, category) => {

        let newCard;
        if(item.category==="rw"){
            newCard=await ServiceApi.insert_single_data({
                    category: category,
                    content: item.content,
                    type : item.type});
                
                item._id=newCard._id;
            }
            else {
                await ServiceApi.update_category({
                    _id: item._id,
                    category: category});
            }

  
        setItems(prevState=>{
            let newItems;
            if(item.category==="rw"){
                newItems = prevState
                .filter(i => i._id !== item._id)
                .concat({ ...item, category})
                
            } else {
            newItems = prevState.filter(i => i._id !== item._id)
            .concat({...item, category}); }
            return [...newItems];

        });

    };


    return (
        <div className={"row"}>
            {categories.map(c => {
                return (
                 <div key={c.category} className="col-wrapper">
                    <div className="board">

                    <h2 className={"col-header"}>{c.category==="rw"? "Rewards": c.category.toUpperCase()}</h2>
                    {c.category!=="rw" ? 
                        <DropWrapper onDrop={onDrop} category={c.category}>
                            <Col>
                                { items.filter(i => i.category === c.category)
                                .map(i => <Card key={String(i._id)} item={i} category={c.category} />)
                                }
                            </Col>
                        </DropWrapper>
                        :<Col>
                        { items.filter(i => i.category === c.category)
                        .map(i => <Card key={String(i._id)} item={i} category={c.category} />)
                        }
                    </Col>}
                </div>
           </div>
           )})}
        </div>

    );
};

export default Board;