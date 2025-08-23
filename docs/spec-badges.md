# Complete Badge System with Emoji Themes

## Streak Badges (Consecutive Days) - 🌱 Plants/Growth Theme
- 🌱 Seedling (3 days)
- 🌿 Herb (5 days)
- 🍀 Four Leaf Clover (10 days)
- 🌸 Cherry Blossom (30 days)
- 🌻 Sunflower (100 days)
- 🌳 Deciduous Tree (200 days)
- 🌲 Evergreen Tree (365 days)
- 🎋 Tanabata Tree (500 days)
- 🌴 Palm Tree (1000 days)
- 🎄 Christmas Tree (2000 days)
- 🌺 Hibiscus (3000 days)

## Spirit Badges (Total Days, Non-consecutive) - 🌫️ Greyscale Plants Theme
Same progression as streak badges, but with CSS filter to make them greyscale:

```css
.spirit-badge {
  filter: grayscale(100%) brightness(0.8);
}
```

- 🌱 Spirit Seedling (3 days total)
- 🌿 Spirit Herb (5 days total)
- 🍀 Spirit Four Leaf Clover (10 days total)
- etc...

## Word Count Milestones - ⭐ Space/Celestial Theme
- ✨ Sparkles - First Words (Hello, 750)
- ⭐ Star - Novella (10K words)
- 🌟 Glowing Star - A Book! (50K words)
- 🌙 Crescent Moon - Hefty Tome (100K words)
- 🌕 Full Moon - Thrilling Sequel (250K words)
- ☄️ Comet - Epic Trilogy (500K words)
- 🪐 Saturn - Anthology (750K words)
- 🌌 Milky Way - Opus (1M words)
- 🌠 Shooting Star - Magnum Opus (2M words)
- ☀️ Sun - Tour De Force (3M words)
- 🌊 Cosmic Wave - Historical Treasure (4M words)
- 🔭 Telescope - Interplanetary Archive (5M words)
- 🚀 Rocket - Galactic Library (10M words)

## Behavior Badges - 🏃 Activities/Actions Theme
- 🐆 Cheetah - Speed Writer (10 days under 20 min)
- 🐹 Hamster - Distraction Free (10 days no distractions)
- 🐓 Rooster - Early Bird (10 days before 9am)
- 🦇 Bat - Night Owl (10 days after 10pm)
- 🏆 Trophy - Monthly Challenge Complete
- 📚 Books - NaNoWriMo (50K in a month)
- 🎯 Direct Hit - Patron (Financial supporter)
- 🏅 Medal - Early Adopter
- 🐼 Red Panda - Rally Master (Brought new people)

## Special Achievement Badges - 🎯 Unique Accomplishments Theme
- 🎂 Birthday Cake - Anniversary (Writing on signup anniversary)
- ⏰ Alarm Clock - Perfect Week (7 days in a row, any word count)
- 📅 Calendar - Perfect Month (wrote every day in a calendar month)
- 🌅 Sunrise - Dawn Writer (wrote at sunrise)
- 🌃 City at Night - Midnight Writer (wrote at exactly midnight)
- ⚡ Lightning Bolt - Lightning Round (1000+ words in under 10 minutes)
- 🎪 Circus Tent - Variety Show (wrote in 10+ different locations)
- 🌍 Earth - Globe Trotter (wrote from 5+ different countries/states)
- 📖 Open Book - Storyteller (wrote a complete story from start to finish)
- 🔥 Fire - Hot Streak (wrote 2000+ words for 7 days straight)

## CSS Implementation for Spirit Badges

```css
/* Base badge styling */
.badge {
  font-size: 2rem;
  display: inline-block;
  margin: 0.25rem;
  transition: all 0.2s ease;
}

.badge:hover {
  transform: scale(1.1);
}

/* Spirit badge greyscale effect */
.badge.spirit {
  filter: grayscale(100%) brightness(0.7) contrast(1.2);
  opacity: 0.8;
}

.badge.spirit::after {
  content: "👻";
  position: absolute;
  font-size: 0.5em;
  top: -5px;
  right: -5px;
  z-index: 1;
}

/* Badge categories for different hover effects */
.badge.streak {
  filter: drop-shadow(0 0 5px #22c55e);
}

.badge.wordcount {
  filter: drop-shadow(0 0 5px #3b82f6);
}

.badge.behavior {
  filter: drop-shadow(0 0 5px #f59e0b);
}

.badge.special {
  filter: drop-shadow(0 0 5px #8b5cf6);
}
```

## Badge Display Structure

```html
<div class="badge-section">
  <h3>🌱 Streak Badges</h3>
  <div class="badge-grid">
    <span class="badge streak earned">🌻</span>
    <span class="badge streak locked">🌳</span>
  </div>
</div>

<div class="badge-section">
  <h3>🌫️ Spirit Badges</h3>
  <div class="badge-grid">
    <span class="badge spirit streak earned">🌻</span>
    <span class="badge spirit streak locked">🌳</span>
  </div>
</div>
```

## Progression Logic Notes
- **Locked badges**: Use CSS opacity and maybe a lock icon overlay
- **Recently earned**: Add a subtle glow animation
- **Progress indicators**: Show progress bars for next badge in each category
- **Tooltips**: Hover to show badge name, requirement, and progress