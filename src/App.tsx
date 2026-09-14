import { useState } from 'react'
import { Card } from './card'
import { Menu } from './menu'
import MonsterContent from './monsters'
import ItemsContent from './items'
import SpellsContent from './spells'
import type { View } from './types'

function App() {

        const [view, setView] = useState<View>('menu');

        const content =
                view === 'monsters' ? <MonsterContent /> :
                view === 'items' ? <ItemsContent /> :
                view === 'spells' ? <SpellsContent /> :
                <Menu onSelect={setView}/>

	return (
                <div id="main">
                        <Card onBack={view !== 'menu' ? () => setView('menu') : undefined}>
                                {content}
                        </Card>
                </div>
        )
}

export default App