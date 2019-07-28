let _ = require('lodash');
const data = [{
    "cylinder": "1",
    "category": "Cylinder",
    "parent": "0"
}, {
    "id_category": "2",
    "cylinder": ["CJ1"],
    "category": "Cylinder",
    "parent": "1"
}, {
    "id_category": "2",
    "cylinder": ["CJ1"],
    "bore": [4, 10],
    "category": "Bore",
    "parent": "2"
}, {
    "id_category": "2",
    "category": "fitting",
    "cylinder": ["CJ1"],
    "bore": [4, 10],
    "fitting": [{
        "4": ["k1", "k2"],
        "10": ["k3", "k4"]
    }],
    "parent": "3"
}, {
    "id_category": "2",
    "cylinder": ["CJ1"],
    "category": "ASP",
    "bore": [4, 10],
    "fitting": [{
        "4": ["k1", "k2"],
        "10": ["k3", "k4"]
    }],
    "asp": [{
        "4": ["ASP1", "ASP2"],
        "10": ["ASP3", "ASP5"]
    }],
    "parent": "2"
}]

console.log(_.filter(data, {
    bore: [10],
    cylinder:"CJ1",
    fitting: [{
        "10": ["k3"]
    }]
}))