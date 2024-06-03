// Page Routing {next js}
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const router = express.Router();

const registeredRoutes = [];
let anyFile = false;

function LoadRoutes(dir, baseUrl = "/") {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      LoadRoutes(filePath, path.join(baseUrl, file));
    } else if (stat.isFile() && path.extname(file) === ".html") {
      let routePath;
      if (file === "*.html") {
        routePath = path.join(baseUrl, ":id");
        anyFile = true;
      } else {
        routePath =
          file === "index.html"
            ? baseUrl || "/"
            : path.join(baseUrl, file.replace(".html", ""));
      }
      console.log(routePath);
      registeredRoutes.push(routePath);
      router.get(routePath, (req, res) => {
        res.sendFile(filePath);
      });
    }
  });
}

app.get("*", (req, res, next) => {
  console.log("Hello");
  const requestRoute = req.path.substring(1);
  console.log(requestRoute);
  if (requestRoute === "") {
    res.sendFile(path.join(__dirname, "pages", "index.html"));
  } else if (registeredRoutes.includes(`/${requestRoute}`)) {
    res.sendFile(path.join(__dirname, "pages", `${requestRoute}.html`));
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, "pages")));
app.use(router);

app.listen(8000, () => {
  LoadRoutes(path.join(__dirname, "pages"));
  console.log("Routes Loaded");
});
