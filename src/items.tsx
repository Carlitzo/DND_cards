import { useState } from 'react'
import type { ItemsContentProps } from "./types";

export default function ItemsContent () {

        const [items, setItems] = useState([]);
        const [isLoading, setIsLoading] = useState(true);

        return <div></div>;
}