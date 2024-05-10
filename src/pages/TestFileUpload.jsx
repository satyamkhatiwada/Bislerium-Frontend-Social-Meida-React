import client from "../../axios.config"

const TestFilePage = () => {

    function UploadFile() {
        client.post("api/Blog/test/upload", {

        },
         {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        })
    }
    return (
        <>

            <input type="file" />
            <button onClick={() => UploadFile()}>Upload</button>
        </>
    )
}

export default TestFilePage;