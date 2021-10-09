'use strict'
const fs = require('fs');
const path = require("path");

module.exports = function AutoFood(mod) {
    let enabled = false;
	
	// blue tier
	const food_s_cri = 206034; // 206014 food craft ID
    	const food_s_pow = 206035; // 206015 food craft ID
	// gold tier
	const food_b_cri = 206037; // 206017 food craft ID
	const food_b_pow = 206038; // 206018 food craft ID
	
	// blue tier
   	const food_s_cri_abn = 70232;
   	const food_s_pow_abn = 70233;
	// gold tier
	const food_b_cri_abn = 70243;
	const food_b_pow_abn = 70244;
	
	// blue tier
	const food_s_cri_name = 'Fish Steak';
    	const food_s_pow_name = 'Fish Fritters';
	// gold tier
	const food_b_cri_name = 'Spicy Fish Buffet';
	const food_b_pow_name = 'Hot Fish Buffet';
	
	// Default Food
	let food_select = food_b_pow;
	let food_select_abn = food_b_pow_abn;
	let food_select_name = food_b_pow_name;
	
    let zones = [];

    let aZone = 0;
    let alive = true;
    let gameId;
    let eat;

    let myAngle;
    let myPosition;
	
    let config_file = require('./config.json');
    updateConfig();
    
    mod.command.add(["food"], (arg_1) => {
		if (!arg_1) {
            enabled = !enabled;
            mod.command.message(`${enabled ? "enabled" : "disabled"}`);
        }
		else if (arg_1 === 'scri') {
			food_select = food_s_cri;
			food_select_abn = food_s_cri_abn;
			food_select_name = food_s_cri_name;
			mod.command.message('Name food : ' + '<font color="#fff317">[' + food_s_cri_name + ']</font>')
		}
		else if (arg_1 === 'spow') {
			food_select = food_s_pow;
			food_select_abn = food_s_pow_abn;
			food_select_name = food_s_pow_name;
			mod.command.message('Name food : ' + '<font color="#fff317">[' + food_s_pow_name + ']</font>')
		}
		else if (arg_1 === 'bcri') {
			food_select = food_b_cri;
			food_select_abn = food_b_cri_abn;
			food_select_name = food_b_cri_name;
			mod.command.message('Name food : ' + '<font color="#fff317">[' + food_b_cri_name + ']</font>')
		}
		else if (arg_1 === 'bpow') {
			food_select = food_b_pow;
			food_select_abn = food_b_pow_abn;
			food_select_name = food_b_pow_name;
			mod.command.message('Name food : ' + '<font color="#fff317">[' + food_b_pow_name + ']</font>')
		}
		else if (arg_1 === 'cri') {
			if(food_select === food_s_cri){
				food_select = food_b_cri;
				food_select_abn = food_b_cri_abn;
				food_select_name = food_b_cri_name;
				mod.command.message('Name food : ' + '<font color="#fff317">[' + food_b_cri_name + ']</font>')
			}
			else if(food_select === food_b_cri){
				food_select = food_s_cri;
				food_select_abn = food_s_cri_abn;
				food_select_name = food_s_cri_name;
				mod.command.message('Name food : ' + '<font color="#fff317">[' + food_s_cri_name + ']</font>')
			}
			else
			{
				food_select = food_b_cri;
				food_select_abn = food_b_cri_abn;
				food_select_name = food_b_cri_name;
				mod.command.message('Name food : ' + '<font color="#fff317">[' + food_b_cri_name + ']</font>')
			}
		}
		else if (arg_1 === 'pow') {
			if(food_select === food_s_pow){
				food_select = food_b_pow;
				food_select_abn = food_b_pow_abn;
				food_select_name = food_b_pow_name;
				mod.command.message('Name food : ' + '<font color="#fff317">[' + food_b_pow_name + ']</font>')
			}
			else if(food_select === food_b_pow){
				food_select = food_s_pow;
				food_select_abn = food_s_pow_abn;
				food_select_name = food_s_pow_name;
				mod.command.message('Name food : ' + '<font color="#fff317">[' + food_s_pow_name + ']</font>')
			}
			else
			{
				food_select = food_b_pow;
				food_select_abn = food_b_pow_abn;
				food_select_name = food_b_pow_name;
				mod.command.message('Name food : ' + '<font color="#fff317">[' + food_b_pow_name + ']</font>')
			}
		}
		else if (arg_1 === 'info') {
        mod.command.message('enabled : ' + '<font color="#00ff00">' + enabled + '</font>')
		mod.command.message('Name food : ' + '<font color="#fff317">[' + food_select_name + ']</font>')
		mod.command.message('ID food : ' + food_select)
		mod.command.message('Buff ID : ' + food_select_abn)
		}
		else if (arg_1 === 'add') {
       if(!config_file["zones"].includes(aZone)) zones.push(aZone);
            config_file["zones"] = zones;
            fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(config_file, null, 2));
		mod.command.message('Add Zone : ' + '<font color="#fff317">[' + aZone + ']</font>')
		}
		else if (arg_1 === 'remove') {
        let i = zones.indexOf(aZone);
            if (i > -1) {
                zones.splice(i, 1);
            }
            config_file["zones"] = zones;
            fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(config_file, null, 2));
		mod.command.message('Remove Zone : ' + '<font color="#fff317">[' + aZone + ']</font>')
		}
		else
		{
			mod.command.message("Wrong Command!")
		}
	})

    mod.hook('S_LOAD_TOPO', 3, (event) => {
		aZone = event.zone;
	})

    mod.hook('C_PLAYER_LOCATION', 5, (event) => {
		myPosition = event.loc;
		myAngle = event.w;
	});

    mod.hook('S_PLAYER_STAT_UPDATE', 17, (event) => {
        if(!enabled) return;
		
		// check Multi-Nostrum
		if (abnormalityDuration(4042) >= 1)
		{
			return;
		}
		
		// check buff
		if((abnormalityDuration(70242) >= 1 || abnormalityDuration(70243) >= 1 || abnormalityDuration(70244) >= 1) && food_select === food_s_pow || food_select === food_s_cri)
		{
			return;
		}
		
		if(abnormalityDuration(food_select_abn) <= 30000)
		{
			eat = false;
		}
		
        alive = event.alive;
        if(event.status == 1 && event.alive && !eat && zones.includes(aZone)){

            mod.send('C_USE_ITEM', 3, {  
                gameId: gameId,
				id: food_select,
				dbid: 0n,
				target: 0n,
				amount: 1,
				dest: { x: 0, y: 0, z: 0 },
				loc: myPosition,
				w: myAngle,
				unk1: 0,
				unk2: 0,
				unk3: 0,
				unk4: true
                });
            
        }
    })

    mod.hook('S_LOGIN', mod.majorPatchVersion >= 81 ? 14 : 13, (event) => {
        enabled = true;
        gameId = event.gameId;
    })

    mod.hook('S_ABNORMALITY_BEGIN', 5, (event) => {
        if ((event.id === food_s_cri_abn || event.id === food_s_pow_abn || event.id === food_b_cri_abn || event.id === food_b_pow_abn) && gameId === event.target) {
			eat = true;
        }
    })

    mod.hook('S_ABNORMALITY_REFRESH', 2, (event) => {
        if ((event.id === food_s_cri_abn || event.id === food_s_pow_abn || event.id === food_b_cri_abn || event.id === food_b_pow_abn) && gameId === event.target) {
            eat = true;
        }
    })

    mod.hook('S_ABNORMALITY_END', 1, (event) => {
        if ((event.id === food_s_cri_abn || event.id === food_s_pow_abn || event.id === food_b_cri_abn || event.id === food_b_pow_abn) && gameId === event.target) {
            eat = false;
        }
    })
	
	function abnormalityDuration(id) {
        const abnormality = mod.game.me.abnormalities[id]
        return abnormality ? abnormality.remaining : 0
    }
	
    async function updateConfig(){
        zones = config_file["zones"];
    }
}
