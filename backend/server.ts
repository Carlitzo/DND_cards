import type { Monster } from "./types.ts";

let _data: any[] = [];
let _monsters: any[] = [];
let _items: any[] = [];
let _spells: any[] = []; // lägg till typer på dessa senare

const requestHandler = async (req: Request) => {
        const url = new URL(req.url);
        const method = req.method;

        if (method === 'GET') {
                switch (url.pathname) {
                        case '/monsters':
                                console.log("received a monster-request")
                                return new Response(JSON.stringify(_monsters), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
                        case '/items':
                                console.log("received a items-request")
                                return new Response(JSON.stringify(_items), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
                        case '/spells':
                                console.log("received a spells-request")
                                return new Response(JSON.stringify(_spells), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
                }
        }

        return new Response('Not found', {status: 404});
}

async function fetchInBatches(urls: string[], batchSize = 10, delayMs = 500) {
        const results = [];

        for (let i = 0; i < urls.length; i+= batchSize) {
                const batch = urls.slice(i, i + batchSize);

                const batchResults = await Promise.all(
                        batch.map(url => fetch(url).then(r => r.json()))
                );

                results.push(...batchResults);

                if (i + batchSize < urls.length) {
                        await new Promise(resolve => setTimeout(resolve, delayMs));
                }
        }

        return results;
}


async function _fetchAllProductsAndInitializeData() {
        await _fetchAndManipulateMonsters();
        await _fetchAndManipulateEquipment();
        await _fetchAndManipulateSpells();
        // equipment-categories är komplex, jag behöver fetcha flera gånger för att samla ihop ett data-set som jag tycker 
        // representerar *items* väl. Det är otroligt kategoriserat i typ magic-items, sen ranged-weapons, melee-weapons (olika fetches)
        // egentligen samma sak för monsters, det finns sjukt mycket information att gå igenom där. (bilder finns)
}

async function _fetchAndManipulateMonsters() {
        let rawMonsterData: any[];
        try {
                const cachedFile = await Deno.readTextFile('./cached_files/monsters.json');
                rawMonsterData = JSON.parse(cachedFile);
                console.log('Loaded monsters from cached file.');
        } catch (error) {
                console.log('No cached file found, fetching from API instead.');

                const res = await fetch('https://www.dnd5eapi.co/api/2014/monsters/'); // fetches all monsters to get their name for next fetch (only returns an object with limited information about the specific monster)
                const data = await res.json();
                const urls = data.results.map((result: any) => `https://www.dnd5eapi.co${result.url}`); // gets the url of all monsters so they can be fetched in batches individually
                
                rawMonsterData = await fetchInBatches(urls, 10, 500);
                console.log(error);
                console.log(_monsters);
                await Deno.writeTextFile('./cached_files/monsters.json', JSON.stringify(rawMonsterData, null, 2));
                console.log(`Fetched and cached ${rawMonsterData.length} monsters`);
        }

        const monsters: Monster[] = rawMonsterData.map(mapToMonster);
        _monsters = sortMonsters(monsters)
        console.log(rawMonsterData.filter(monster => monster.legendary_actions.length !== 0));
} 

function mapToMonster(rawMonsterData: any): Monster {
        return {
                name: rawMonsterData.name,
                size: rawMonsterData.size,
                type: rawMonsterData.type,
                alignment: rawMonsterData.alignment,
                armor_class: rawMonsterData.armor_class,
                hp: rawMonsterData.hit_points,
                speed: rawMonsterData.speed,
                stats: {
                        str: rawMonsterData.strength,
			dex: rawMonsterData.dexterity,
			con: rawMonsterData.constitution,
			int: rawMonsterData.intelligence,
			wis: rawMonsterData.wisdom,
			cha: rawMonsterData.charisma
                },
                damage_vulnerabilities: rawMonsterData.damage_vulnerabilities,
                damage_resistances: rawMonsterData.damage_resistances,
                damage_immunities: rawMonsterData.damage_immunities,
                condition_immunities: rawMonsterData.condition_immunities,
                darkvision: rawMonsterData.senses?.darkvision !== undefined,
                languages: rawMonsterData.languages,
                challenge_rating: rawMonsterData.challenge_rating,
                special_abilities: rawMonsterData.special_abilities,
                actions: rawMonsterData.actions,
                image: rawMonsterData.image ? `https://www.dnd5eapi.co${rawMonsterData.image}` : '',
                url: rawMonsterData.url,
                legendary_actions: rawMonsterData.legendary_actions,
                reactions: rawMonsterData.reactions
        };
}

function sortMonsters(monsters: any[]) {
        return monsters.sort((monsterA, monsterB) => {
                if (monsterA.type < monsterB.type) return -1;
                if (monsterA.type > monsterB.type) return 1;
                
                return monsterA.challenge_rating - monsterB.challenge_rating;
        });
}

async function _fetchAndManipulateEquipment() {
        const res = await fetch('https://www.dnd5eapi.co/api/2014/equipment/');
        const data = await res.json();
        
//        console.log(data.results)
//        console.log(data.count)

}

async function _fetchAndManipulateSpells() {
        const res = await fetch('https://www.dnd5eapi.co/api/2014/spells/');
        const data = await res.json();
        
//        console.log(data.results)
//        console.log(data.count)

}

async function main() {
        await _fetchAllProductsAndInitializeData();
        console.log("Data fetched, starting server");
        Deno.serve({port: 8888}, requestHandler);
}

main();