# wiki-app

This is a Wiki app with a React - [Next.js](https://nextjs.org/) frontend and a [Flask](https://flask.palletsprojects.com/en/2.3.x/) backend.

Most if not all relevant frontend code exists inside `./src/pages/` within the `index.tsx` and `_app.tsx` files.
This was a conscious descision as splitting up components into seperate files can slow down development.
The provided backend has been placed inside `./src/server/`. One small edit to the `wiki.py` file within the `write_page` function:

```python
def write_page(page):
    new_revision = request.json["page"]

# has been changed to:

def write_page(page):
    new_revision = request.json["page"].encode(encoding="UTF-8")
```

This was because the file is later opened with the `wb` option, which only accepts writes of byte format.

## Steps to get up and running from git bundle

Below are the steps required to get a local environment up and running with the git bundle:

1. Download `passfort.bundle`
2. Place `passfort.bundle` in your desired directory
3. Run `git clone passfort.bundle`, this will create a `passfort` directory in your current directory
4. Navigate into the newly created `passfort` directory
5. Run `git pull origin main`
6. Navigate to `./src/server/`
7. Run the `./run.sh` script within the `server` directory
8. Once backend server is up and running, you can run `npm run dev` from anywhere within the `passfort`
   directory to start the local environment, located at `http://localhost:3000/` by default

## Route

This is a quick description of the url routing present in the project:

-   home (/)

    -   The home route at `sitename/` renders the `<Content />` component
    -   This page contains all pages currently created on the site, as well as a
        "Create New Page" button which redirects the user to the `edit` route

-   /page/:title/:revision?

    -   The page route at `sitename/page/:title/:revision?` renders the `<Page />` component with `title` and optional `revision` url parameters
    -   This page contains the selected page content, as well as a "History"
        dropdown which can be used to change the currently viewed revison
    -   There are also "Edit Page" (redirects to edit) and "Return Home" buttons

-   /edit/:title?

    -   The edit route at `sitename/edit/:title?` renders the `<EditPage />` component with an optional `title` parameter
    -   There are "Create" and "Discard" buttons. "Create" is only clickable when all required fields are populated when clicked it redirects
        the user to a the newly created page. When "Discard" is clicked, the user is redirected to the route they were previously on
    -   If no title is given, the user sees a blank textarea as well as a Page Title input, hidden when title is provided

## Tests

Tests can be run with `npm test` from anywhere withint the passfort directory.

Written tests can be found at `./src/__tests__`.

## Known issues

-   [ ] Navigating manually to a page that exists: `sitename/page/pagename/revision` with a revision that doesnt prompts the user with a
        "Page: pagename not found" message. The History dropdown with known revisions is also not functioning
-   [ ] If the user creates / edits a page with a word without spaces, this word will extend beyond the page when viewing it.
        This can be resolved with css property `word-break: break-all;`, however this creates breaks in short words
-   [ ] Very rarely, after page edit, the user is navigated to the previous revision and not the new one. This is probably a asynchrony issue
-   [ ] Web page is quite bland, background color / some images or logos could help bring it to life
