function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function simulateBattle(attackingTroops, defendingTroops) {
    let attackGroupSize = Math.min(attackingTroops, 3);
    let defenseGroupSize = Math.min(defendingTroops, 2);

    let attackRolls = [];
    let defenseRolls = [];

    for (let i = 0; i < attackGroupSize; i++) {
        attackRolls.push(rollDice());
    }
    for (let i = 0; i < defenseGroupSize; i++) {
        defenseRolls.push(rollDice());
    }

    attackRolls.sort((a, b) => b - a);
    defenseRolls.sort((a, b) => b - a);

    let result = {
        attackingTroops: attackingTroops,
        defendingTroops: defendingTroops,
        attackRolls: attackRolls,
        defenseRolls: defenseRolls,
        attackLosses: 0,
        defenseLosses: 0,
        attackColors: [],
        defenseColors: []
    };

    for (let i = 0; i < Math.min(attackRolls.length, defenseRolls.length); i++) {
        if (attackRolls[i] > defenseRolls[i]) {
            result.defendingTroops--;
            result.defenseLosses++;
            result.attackColors.push('green');
            result.defenseColors.push('red');
        } else {
            result.attackingTroops--;
            result.attackLosses++;
            result.attackColors.push('red');
            result.defenseColors.push('green');
        }
    }

    for (let i = result.attackColors.length; i < attackRolls.length; i++) {
        result.attackColors.push('black');
    }
    for (let i = result.defenseColors.length; i < defenseRolls.length; i++) {
        result.defenseColors.push('black');
    }

    return result;
}

function simulateAttack(attackingTroops, defendingTroops) {
    let activeAttackingTroops = Math.min(attackingTroops, 3);
    let activeDefendingTroops = Math.min(defendingTroops, 2);
    let waitingAttackingTroops = attackingTroops - activeAttackingTroops;
    let waitingDefendingTroops = defendingTroops - activeDefendingTroops;

    let log = [];

    let round = 1;
    while (activeAttackingTroops > 0 && activeDefendingTroops > 0) {
        let result = simulateBattle(activeAttackingTroops, activeDefendingTroops);
        let attackRollsColored = result.attackRolls.map((roll, index) => `<span style="color:${result.attackColors[index]}">${roll}</span>`).join(', ');
        let defenseRollsColored = result.defenseRolls.map((roll, index) => `<span style="color:${result.defenseColors[index]}">${roll}</span>`).join(', ');

        log.push(`<div class="round-log">Runde ${round}<br>Angrep: ${result.attackingTroops + result.attackLosses} (${waitingAttackingTroops}): ${attackRollsColored}<br>Forsvar: ${result.defendingTroops + result.defenseLosses} (${waitingDefendingTroops}): ${defenseRollsColored}</div>`);

        activeAttackingTroops = result.attackingTroops;
        activeDefendingTroops = result.defendingTroops;

        if (activeAttackingTroops === 0 && waitingAttackingTroops > 0) {
            activeAttackingTroops = Math.min(waitingAttackingTroops, 3);
            waitingAttackingTroops -= activeAttackingTroops;
        }

        if (activeDefendingTroops === 0 && waitingDefendingTroops > 0) {
            activeDefendingTroops = Math.min(waitingDefendingTroops, 2);
            waitingDefendingTroops -= activeDefendingTroops;
        }

        round++;
    }


    return [log, activeAttackingTroops, activeDefendingTroops, waitingAttackingTroops, waitingDefendingTroops];
}



document.getElementById("simulateButton").addEventListener("click", function() {


    let attackingTroops = parseInt(document.getElementById("attackingTroops").value);
    let defendingTroops = parseInt(document.getElementById("defendingTroops").value);

    
    let res = simulateAttack(attackingTroops, defendingTroops);
    let log = res[0];
    let activeAttackingTroops = res[1];
    let activeDefendingTroops = res[2];
    let waitingAttackingTroops = res[3];
    let waitingDefendingTroops = res[4];

    let winner = activeAttackingTroops + waitingAttackingTroops > 0 ? 'Angrep' : 'Forsvar';
    let loser = winner === 'Angrep' ? 'Forsvar' : 'Angrep';
    let winnerCount = winner === 'Angrep' ? activeAttackingTroops + waitingAttackingTroops : activeDefendingTroops + waitingDefendingTroops;
    let loserCount = loser === 'Angrep' ? activeAttackingTroops + waitingAttackingTroops : activeDefendingTroops + waitingDefendingTroops;

    let headerString = `<b class="result">Resultat<br><span class="winner">${winner}: ${winnerCount}</span><br><span class="loser">${loser}: ${loserCount}</span></b>`;


    document.getElementById("header").innerHTML = headerString;

    document.getElementById("result").innerHTML = log.join('');
});