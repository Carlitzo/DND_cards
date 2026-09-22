import type { Monster, Item, Spell } from "./types.ts";

let _monsters: Monster[] = [];
let _items: Item[] = [];
let _spells: Spell[] = [];

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
        await _fetchAndManipulateItems();
        await _fetchAndManipulateSpells();
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
                const monsterData = await res.json();
                const urls = monsterData.results.map((result: any) => `https://www.dnd5eapi.co${result.url}`); // gets the url of all monsters so they can be fetched in batches individually
                
                rawMonsterData = await fetchInBatches(urls, 10, 500);
                console.log(error);
                await Deno.writeTextFile('./cached_files/monsters.json', JSON.stringify(rawMonsterData, null, 2));
                console.log(`Fetched and cached ${rawMonsterData.length} monsters`);
        }

        const monsters: Monster[] = rawMonsterData.map(mapToMonster);
        _monsters = sortMonsters(monsters)
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
                condition_immunities: rawMonsterData.condition_immunities?.map((immunityObject: any) => {
                        return immunityObject.name ?? [];
                }),
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

function sortMonsters(monsters: Monster[]) {
	return monsters.sort((monsterA, monsterB) => {
		if (monsterA.challenge_rating < monsterB.challenge_rating) return 1;
		if (monsterA.challenge_rating > monsterB.challenge_rating) return -1;

		if (monsterA.name < monsterB.name) return -1;
		if (monsterA.name > monsterB.name) return 1;
		return 0;
	});
}

async function _fetchAndManipulateItems() {
        let rawItemData: any[];
        try {
                const cachedFile = await Deno.readTextFile('./cached_files/items.json');
                rawItemData = JSON.parse(cachedFile);
                console.log('Loaded items from cached file.');
        } catch (error) {
                console.log('No cached file found, fetching from API instead.');
                
                const res = await fetch('https://www.dnd5eapi.co/api/2014/magic-items/');
                const itemData = await res.json();
                const urls = itemData.results.map((result: any) => `https://www.dnd5eapi.co${result.url}`);
                
                rawItemData = await fetchInBatches(urls, 10, 500);
                console.log(error);
                await Deno.writeTextFile('./cached_files/items.json', JSON.stringify(rawItemData, null, 2));
                console.log(`Fetched and cached ${rawItemData.length} items`);
        }

        const items: Item[] = rawItemData.map(mapToItem);
        _items = sortItems(items);
}

function mapToItem(rawItemData: any): Item {
        return {
                name: rawItemData.name,
                category: rawItemData.equipment_category.name,
                image: rawItemData.image ? `https://www.dnd5eapi.co${rawItemData.image}` : '',
                url: rawItemData.url,
                rarity: rawItemData.rarity.name,
                desc: rawItemData.desc,
                attunement: rawItemData.desc[0].includes("attunement") ? "Attunement required" : "No attunement required"
        }
}

function sortItems(items: Item[]) {
	return items.sort((itemA, itemB) => {
		if (itemA.category < itemB.category) return 1;
		if (itemA.category > itemB.category) return -1;

		if (itemA.name < itemB.name) return -1;
		if (itemA.name > itemB.name) return 1;
		return 0;
	});
}

async function _fetchAndManipulateSpells() {
        let rawSpellData: any[];
        try {
                const cachedFile = await Deno.readTextFile('./cached_files/spells.json');
                rawSpellData = JSON.parse(cachedFile);
                console.log('Loaded items from cached file');
        } catch (error) {
                console.log('No cached file found, fetching from API instead.');

                const res = await fetch('https://www.dnd5eapi.co/api/2014/spells/');
                const spellData = await res.json();
                const urls = spellData.results.map((result: any) => `https://www.dnd5eapi.co${result.url}`);

                rawSpellData = await fetchInBatches(urls, 10, 500);
                console.log(error);
                await Deno.writeTextFile('./cached_files/spells.json', JSON.stringify(rawSpellData, null, 2));
                console.log(`Fetched and cached ${rawSpellData.length} spells`)
        }

        const spells: any[] = rawSpellData.map(mapToSpell);
        console.log(rawSpellData);
        _spells = sortSpells(spells);
}

function mapToSpell(rawSpellData: any): Spell {
        return {
                name: rawSpellData.name,
                desc: rawSpellData.desc,
                range: rawSpellData.range,
                components: rawSpellData.components,
                ritual: rawSpellData.ritual,
                duration: rawSpellData.duration,
                concentration: rawSpellData.concentration,
                casting_time: rawSpellData.casting_time,
                level: rawSpellData.level,
                dc: rawSpellData.dc.dc_type.index,
                dc_success: rawSpellData.dc.dc_success,
                school_of_magic: rawSpellData.school.name,
                classes: rawSpellData.classes.map((classInfo: any) => {
                        return classInfo.name
                }),
                subclasses: rawSpellData.subclasses.map((subclass: any) => {
                        return subclass.name;
                })
        }
}

function sortSpells(spells: Spell[]) {
        return spells.sort((spellA, spellB) => {
                if (spellA.level !== spellB.level) {
                        return spellB.level - spellA.level;
                }
                if (spellA.name < spellB.name) return 1;
                if (spellA.name > spellB.name) return -1;
                
                return 0;
        });
}

async function main() {
        await _fetchAllProductsAndInitializeData();
        console.log("Data fetched, starting server");
        Deno.serve({port: 8888}, requestHandler);
}

main();