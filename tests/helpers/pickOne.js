var pickOne = function() {
    var games = ["Chess","Cross and Circle game","DaldÃ¸s","Downfall","DVONN","Fanorona","Game of the Generals","Ghosts",
        "Abalone","Agon","Backgammon","Battleship","Blockade","Blood Bowl","Bul","Camelot","Checkers",
        "Go","Gipf","Guess Who?","Hare and Hounds","Hex","Hijara","Isola","Janggi (Korean Chess)","Le Jeu de la Guerre",
        "Patolli","Plateau","PÃœNCT","Rithmomachy","SÃ¡hkku","Senet","Shogi","Space Hulk","Stratego","Sugoroku",
        "TÃ¢b","Tablut","Tantrix","Wari","Xiangqi (Chinese chess)","YINSH","ZÃˆRTZ","Kalah","Kamisado","Liu po",
        "Lost Cities","Mad Gab","Master Mind","Nine Men's Morris","Obsession","Othello","Carcasonne", "Settlers of Cataan",
        "Arkham Horrors", "Bang", "Dominion", "Magic the Gathering", "Red Dragon Inn", "Cards Against Humanity"
    ];
    var firstNames = ["Sophie","Isabelle","Emily","Olivia","Lily","Chloe","Isabella",
        "Amelia","Jessica","Sophia","Ava","Charlotte","Mia","Lucy","Grace","Ruby",
        "Ella","Evie","Freya","Isla","Poppy","Daisy","Layla", "Michael", "Jacob", "Douglas",
        "Terry", "Gillian", "David", "Marc", "Tim", "Steve", "Jeff"];
    var middleInitial = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var suffix = [' Jr.', '', ' Sr.', ' I', ' II', ' III', ' IV', 'Ph.D'];
    var lastNames = ["Beckham","Black","Braxton","Brennan","Brock","Bryson","Cadwell",
        "Cage","Carson","Chandler","Cohen","Cole","Corbin","Dallas","Dalton","Dane",
        "Donovan","Easton","Fisher","Fletcher","Grady","Greyson","Griffin","Gunner",
        "Hayden","Hudson","Hunter","Jacoby","Jagger","Jaxon","Jett","Kade","Kane",
        "Keating","Keegan","Kingston","Kobe", "Walker", "Adams", "Pratchett", "Russette",
        "Ropponen", "Sopko", "Pryciak", "Church", "McMahonn", "Hanley"];
    
    var data = [];
    for (var row = 1; row <= 10000; row++) {
        var val = "";
        val += firstNames[row % firstNames.length] + " ";
        val += middleInitial[row % middleInitial.length] + ' ';
        val += lastNames[row % lastNames.length] + ", ";
        val += suffix[row % suffix.length] + ' ';
        val += games[row % games.length];
        data.push(val);
    }
    return data;
};