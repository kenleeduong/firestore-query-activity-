// firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDmT1OPVhIg2Xz0_-HoZRn_xd0ALIoqK_w",
    authDomain: "in-class-activity-30f4a.firebaseapp.com",
    projectId: "in-class-activity-30f4a",
    storageBucket: "in-class-activity-30f4a.firebasestorage.app",
    messagingSenderId: "271604223919",
    appId: "1:271604223919:web:a53a0a39b012a15856a95a",
    measurementId: "G-5C88QBKNHX"
};

// init firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Task 1 - create team objects and add them to firestore
const team1 = {
    name: "Real Madrid",
    city: "Madrid",
    country: "Spain",
    topScorers: ["Ronaldo", "Benzema", "Hazard"],
    fans: 798
};

const team2 = {
    name: "Barcelona",
    city: "Barcelona",
    country: "Spain",
    topScorers: ["Messi", "Suarez", "Puyol"],
    fans: 738
};

const team3 = {
    name: "Manchester United",
    city: "Manchester",
    country: "England",
    topScorers: ["Cantona", "Rooney", "Ronaldo"],
    fans: 755
};

const team4 = {
    name: "Manchester City",
    city: "Manchester",
    country: "England",
    topScorers: ["Sterling", "Aguero", "Haaland"],
    fans: 537
};

const team5 = {
    name: "Brazil National Team",
    city: "Not applicable",
    country: "Brazil",
    topScorers: ["Ronaldinho", "Cafu", "Bebeto"],
    fans: 950
};

const team6 = {
    name: "Argentina national team",
    city: "Not applicable",
    country: "Argentina",
    topScorers: ["Messi", "Batistuta", "Maradona"],
    fans: 888
};

const team7 = {
    name: "Atletico Madrid",
    city: "Madrid",
    country: "Spain",
    topScorers: ["Aragonés", "Griezmann", "Torez"],
    fans: 400
};

// add teams to firestore
async function addTeams() {
    const output = document.getElementById("task1-output");
    try {
        await db.collection("teams").add(team1);
        await db.collection("teams").add(team2);
        await db.collection("teams").add(team3);
        await db.collection("teams").add(team4);
        await db.collection("teams").add(team5);
        await db.collection("teams").add(team6);
        await db.collection("teams").add(team7);
        output.innerHTML = "<p>All 7 teams added to Firestore!</p>";
    } catch (error) {
        output.innerHTML = "<p>Error adding teams: " + error.message + "</p>";
    }
}

// Task 2 - queries

// display results on the page
function displayResults(title, results) {
    const output = document.getElementById("output");
    let html = "<h3>" + title + "</h3>";
    if (results.length === 0) {
        html += "<p>No results found.</p>";
    }
    results.forEach(function(team) {
        html += '<div class="result">';
        html += "<strong>" + team.name + "</strong><br>";
        html += "City: " + team.city + "<br>";
        html += "Country: " + team.country + "<br>";
        html += "Top Scorers: " + team.topScorers.join(", ") + "<br>";
        html += "Worldwide Fans: " + team.fans + "M";
        html += "</div>";
    });
    output.innerHTML = html;
}

// teams in spain
async function showTeamsInSpain() {
    const snapshot = await db.collection("teams").where("country", "==", "Spain").get();
    const results = [];
    snapshot.forEach(function(doc) {
        results.push(doc.data());
    });
    displayResults("All teams in Spain", results);
}

// teams in madrid spain
async function showTeamsInMadridSpain() {
    const snapshot = await db.collection("teams")
        .where("country", "==", "Spain")
        .where("city", "==", "Madrid")
        .get();
    const results = [];
    snapshot.forEach(function(doc) {
        results.push(doc.data());
    });
    displayResults("All teams in Madrid, Spain", results);
}

// national teams only
async function showNationalTeams() {
    const snapshot = await db.collection("teams").where("city", "==", "Not applicable").get();
    const results = [];
    snapshot.forEach(function(doc) {
        results.push(doc.data());
    });
    displayResults("All National Teams", results);
}

// not in spain
async function showTeamsNotInSpain() {
    const snapshot = await db.collection("teams").where("country", "!=", "Spain").get();
    const results = [];
    snapshot.forEach(function(doc) {
        results.push(doc.data());
    });
    displayResults("All teams NOT in Spain", results);
}

// not in spain or england
async function showTeamsNotInSpainOrEngland() {
    const snapshot = await db.collection("teams")
        .where("country", "not-in", ["Spain", "England"])
        .get();
    const results = [];
    snapshot.forEach(function(doc) {
        results.push(doc.data());
    });
    displayResults("All teams NOT in Spain or England", results);
}

// spain with more than 700m fans
async function showSpainOver700M() {
    const snapshot = await db.collection("teams")
        .where("country", "==", "Spain")
        .where("fans", ">", 700)
        .get();
    const results = [];
    snapshot.forEach(function(doc) {
        results.push(doc.data());
    });
    displayResults("All teams in Spain with more than 700M fans", results);
}

// fans between 500 and 600
async function showFans500to600() {
    const snapshot = await db.collection("teams")
        .where("fans", ">=", 500)
        .where("fans", "<=", 600)
        .get();
    const results = [];
    snapshot.forEach(function(doc) {
        results.push(doc.data());
    });
    displayResults("All teams with 500M-600M fans", results);
}

// ronaldo top scorer
async function showRonaldoScorer() {
    const snapshot = await db.collection("teams")
        .where("topScorers", "array-contains", "Ronaldo")
        .get();
    const results = [];
    snapshot.forEach(function(doc) {
        results.push(doc.data());
    });
    displayResults("All teams where Ronaldo is a top scorer", results);
}

// ronaldo maradona or messi top scorer
async function showRonaldoMaradonaMessi() {
    const snapshot = await db.collection("teams")
        .where("topScorers", "array-contains-any", ["Ronaldo", "Maradona", "Messi"])
        .get();
    const results = [];
    snapshot.forEach(function(doc) {
        results.push(doc.data());
    });
    displayResults("All teams where Ronaldo, Maradona, or Messi is a top scorer", results);
}

// Task 3 - updating data
async function updateFansAndNames() {
    var output = document.getElementById("task3-output");

    // find real madrid
    var rmSnapshot = await db.collection("teams").where("name", "==", "Real Madrid").get();
    rmSnapshot.forEach(async function(doc) {
        await db.collection("teams").doc(doc.id).update({
            fans: 811,
            name: "Real Madrid FC"
        });
    });

    // find barcelona
    var barcaSnapshot = await db.collection("teams").where("name", "==", "Barcelona").get();
    barcaSnapshot.forEach(async function(doc) {
        await db.collection("teams").doc(doc.id).update({
            fans: 747,
            name: "FC Barcelona"
        });
    });

    output.innerHTML = "<p>Updated fans and names for Real Madrid and Barcelona!</p>";
}

// update top scorers
async function updateScorers() {
    var output = document.getElementById("task3-output");

    // real madrid - remove hazard, add crispo
    var rmSnapshot = await db.collection("teams").where("name", "==", "Real Madrid FC").get();
    rmSnapshot.forEach(async function(doc) {
        await db.collection("teams").doc(doc.id).update({
            topScorers: firebase.firestore.FieldValue.arrayRemove("Hazard")
        });
        await db.collection("teams").doc(doc.id).update({
            topScorers: firebase.firestore.FieldValue.arrayUnion("Crispo")
        });
    });

    // barcelona - remove puyol, add deco
    var barcaSnapshot = await db.collection("teams").where("name", "==", "FC Barcelona").get();
    barcaSnapshot.forEach(async function(doc) {
        await db.collection("teams").doc(doc.id).update({
            topScorers: firebase.firestore.FieldValue.arrayRemove("Puyol")
        });
        await db.collection("teams").doc(doc.id).update({
            topScorers: firebase.firestore.FieldValue.arrayUnion("Deco")
        });
    });

    output.innerHTML = "<p>Updated top scorers for Real Madrid and Barcelona!</p>";
}

// add jersey colors
async function addJerseyColors() {
    var output = document.getElementById("task3-output");

    var colorRM = {
        home: "White",
        away: "Black"
    };

    var colorBarca = {
        home: "Red",
        away: "Gold"
    };

    // real madrid
    var rmSnapshot = await db.collection("teams").where("name", "==", "Real Madrid FC").get();
    rmSnapshot.forEach(async function(doc) {
        await db.collection("teams").doc(doc.id).update({
            color: colorRM
        });
    });

    // barcelona
    var barcaSnapshot = await db.collection("teams").where("name", "==", "FC Barcelona").get();
    barcaSnapshot.forEach(async function(doc) {
        await db.collection("teams").doc(doc.id).update({
            color: colorBarca
        });
    });

    output.innerHTML = "<p>Added jersey colors for Real Madrid and Barcelona!</p>";
}

// update away colors
async function updateAwayColors() {
    var output = document.getElementById("task3-output");

    // real madrid - away to purple
    var rmSnapshot = await db.collection("teams").where("name", "==", "Real Madrid FC").get();
    rmSnapshot.forEach(async function(doc) {
        await db.collection("teams").doc(doc.id).update({
            "color.away": "Purple"
        });
    });

    // barcelona - away to pink
    var barcaSnapshot = await db.collection("teams").where("name", "==", "FC Barcelona").get();
    barcaSnapshot.forEach(async function(doc) {
        await db.collection("teams").doc(doc.id).update({
            "color.away": "Pink"
        });
    });

    output.innerHTML = "<p>Updated away jersey colors!</p>";
}
