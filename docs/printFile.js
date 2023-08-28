import readDDS from "../dist/index.js";

window.onload = async () => {    
    const response = await fetch("docs/test.dds");
    const file = await response.arrayBuffer();
    printFile(file, "Example output");
};

window.fileSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const file = formData.get("image");
    const byteArray = await file.arrayBuffer();
    printFile(byteArray, file.name);
}


async function printFile(file, title){
    const titleElement = document.getElementById("fileName");
    titleElement.innerHTML = title;

    const outputElement = document.getElementById("json");
    try {
        const ddsFileLayout = readDDS(file);

        // Create objects that look like ArrayBuffers,
        // because Arraybuffers can not be stringified to JSON.
        ddsFileLayout.bdata = { byteLength: ddsFileLayout.bdata?.byteLength };
        ddsFileLayout.bdata2 = { byteLength: ddsFileLayout.bdata2?.byteLength };

        const indentation = 4;
        const properties = null; // All
        const json = JSON.stringify(ddsFileLayout, properties, indentation);
        
        console.log(title, ddsFileLayout);        
        outputElement.innerHTML = json;
        // Apply style form Google code-prettify.
        // Have to remove class for reprinting to work,
        // PR.prettyPrint() re-adds it.
        outputElement.classList.remove("prettyprinted");
        // Requires Google code-prettify to be loaded in the document.
        // <script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js?autorun=false"></script>
        window.PR.prettyPrint();
    }
    catch(error){
        outputElement.innerHTML = error.message;
    }
}