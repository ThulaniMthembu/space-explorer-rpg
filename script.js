document.addEventListener('DOMContentLoaded', function () {
	const gameContainer = document.getElementById('game-container');
	const infoPanel = document.getElementById('info-panel');
	const playerStats = document.getElementById('player-stats');
	const alienStats = document.getElementById('alien-stats');
	const healthValue = document.getElementById('health-value');
	const artifactsCount = document.getElementById('artifacts-count');
	const alienHealthValue = document.getElementById('alien-health-value');
	const startBtn = document.getElementById('start-btn');
	const actionBtn1 = document.getElementById('action-btn1');
	const actionBtn2 = document.getElementById('action-btn2');
	const roundHeading = document.getElementById('round-heading');
	const roundCount = document.getElementById('round-count');
	const sceneTitle = document.getElementById('scene-title');
	const sceneText = document.getElementById('scene-text');

	let currentRound = 1;
	let maxArtifacts = 3;
	let currentArtifacts = 0;
	let playerHealth = 100;
	let alienHealth = 20;
	let missionStarted = false;
	let gameOver = false;
	let inCombat = false;

	const actionBtn1Text = 'Explore';
	const actionBtn2Text = 'Skip Day';
	actionBtn1.textContent = actionBtn1Text;
	actionBtn2.textContent = actionBtn2Text;

	function updateArtifactDisplay() {
		artifactsCount.textContent = `${currentArtifacts} of ${maxArtifacts}`;
	}

	function toggleAlienStats(show) {
		alienStats.classList.toggle('hidden', !show);
	}

	function updatePlayerHealth(value) {
		playerHealth = Math.max(0, Math.min(100, value));
		healthValue.textContent = playerHealth;
	}

	function updateAlienHealth(value) {
		alienHealth = Math.max(0, value);
		alienHealthValue.textContent = alienHealth;
	}

	function updateRoundCount() {
		currentRound++;
		roundCount.textContent = currentRound;
	}

	function toggleButtons(start, action1, action2) {
		startBtn.classList.toggle('hidden', !start);
		actionBtn1.classList.toggle('hidden', !action1);
		actionBtn2.classList.toggle('hidden', !action2);
	}

	function setScene(title, text) {
		sceneTitle.textContent = title;
		sceneText.textContent = text;
	}

	function explore() {
		const random = Math.random();
		if (random < 0.3) {
			currentArtifacts++;
			updateArtifactDisplay();
			setScene(
				'Discovery!',
				`You found a Xenonite artifact! You now have ${currentArtifacts} of ${maxArtifacts} Xenonites.`
			);
		} else if (random < 0.6) {
			const oxygenLoss = Math.floor(Math.random() * 10) + 5;
			updatePlayerHealth(playerHealth - oxygenLoss);
			setScene(
				'Danger!',
				`You encountered a hazard and lost ${oxygenLoss} oxygen.`
			);
		} else {
			setScene('Nothing Found', 'You explored but found nothing of interest.');
		}

		// Decrease oxygen over time
		updatePlayerHealth(playerHealth - 2);

		if (currentArtifacts === maxArtifacts) {
			endGame(true);
		} else if (playerHealth <= 0) {
			endGame(false);
		} else {
			updateRoundCount();
			// Increase chance of alien encounter as days pass
			if (Math.random() < 0.1 * currentRound) {
				alienEncounter();
			}
		}
	}

	function skipDay() {
		const oxygenLoss = Math.floor(Math.random() * 5) + 5;
		updatePlayerHealth(playerHealth - oxygenLoss);
		updateRoundCount();
		setScene(
			'Day Skipped',
			`You rested for a day, losing ${oxygenLoss} oxygen in the process.`
		);

		if (playerHealth <= 0) {
			endGame(false);
		} else {
			// Increase chance of alien encounter as days pass
			if (Math.random() < 0.2 * currentRound) {
				alienEncounter();
			}
		}
	}

	function alienEncounter() {
		inCombat = true;
		toggleAlienStats(true);
		alienHealth = 20 + currentRound * 2; // Aliens get stronger as days pass
		updateAlienHealth(alienHealth);
		setScene(
			'Alien Encounter!',
			"You've encountered an alien! Defeat it to continue your mission."
		);
		actionBtn1.textContent = 'Attack';
		actionBtn2.textContent = 'Defend';
	}

	function combat(action) {
		if (action === 'Attack') {
			const damage = Math.floor(Math.random() * 10) + 1;
			updateAlienHealth(alienHealth - damage);
			setScene('Attack!', `You dealt ${damage} damage to the alien.`);
		} else {
			const heal = Math.floor(Math.random() * 5) + 1;
			updatePlayerHealth(playerHealth + heal);
			setScene('Defend!', `You regained ${heal} oxygen while defending.`);
		}

		if (Math.random() < 0.7) {
			const alienDamage = Math.floor(Math.random() * 15) + 5;
			updatePlayerHealth(playerHealth - alienDamage);
			sceneText.textContent += ` The alien counterattacked, dealing ${alienDamage} damage.`;
		}

		if (alienHealth <= 0) {
			inCombat = false;
			toggleAlienStats(false);
			const oxygenBonus = Math.floor(Math.random() * 20) + 10;
			updatePlayerHealth(playerHealth + oxygenBonus);
			setScene(
				'Victory!',
				`You defeated the alien and gained ${oxygenBonus} oxygen! You can continue your mission.`
			);
			actionBtn1.textContent = actionBtn1Text;
			actionBtn2.textContent = actionBtn2Text;
		} else if (playerHealth <= 0) {
			endGame(false);
		}
	}

	function endGame(victory) {
		gameOver = true;
		toggleButtons(true, false, false);
		if (victory) {
			setScene(
				'Mission Accomplished!',
				"You've collected all the Xenonites and completed your mission!"
			);
		} else {
			setScene('Game Over', 'Your oxygen depleted. The mission has failed.');
		}
		startBtn.textContent = 'Play Again';
	}

	startBtn.addEventListener('click', function () {
		if (gameOver) {
			currentRound = 1;
			currentArtifacts = 0;
			playerHealth = 100;
			alienHealth = 20;
			missionStarted = false;
			gameOver = false;
			inCombat = false;
			updateArtifactDisplay();
			updatePlayerHealth(100);
			roundCount.textContent = currentRound;
			toggleAlienStats(false);
		}

		missionStarted = true;
		toggleButtons(false, true, true);
		setScene(
			'Mission Started',
			'You begin your exploration of Planet Xyphora. Choose your action.'
		);
	});

	actionBtn1.addEventListener('click', function () {
		if (inCombat) {
			combat('Attack');
		} else {
			explore();
		}
	});

	actionBtn2.addEventListener('click', function () {
		if (inCombat) {
			combat('Defend');
		} else {
			skipDay();
		}
	});

	updateArtifactDisplay();
	toggleAlienStats(false);
});
