import { BlogType } from '@/types/types'
import React, { useEffect, useState } from 'react'
import BlogReaderModal from './blogReaderModal';
import Image from 'next/image';
import * as babel from "babel-standalone";
import { addCodeFrame } from '@/public/utils/blogFrame';
import { createBlog, updateBlog } from '@/public/utils/blogUtils';
import { useRouter } from 'next/navigation';
import { blogDefault } from '@/public/utils/blogDefault';
import ReactCodeMirror, { EditorView } from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';
import { myTheme } from '@/public/utils/codeTheme';

type BlogEditorProps = {
    toEdit?: BlogType | undefined
}

export default function BlogEditor(props: BlogEditorProps) {
    const [blogCode, setBlog] = useState(<></>);
    const [loading, setLoading] = useState(true);
    const [blogError, setBlogError] = useState("");
  
    const [inputTitle, setInputTitle] = useState("");
    const [inputPostDate, setInputPostDate] = useState("");
    const [inputSummary, setInputSummary] = useState("");
    const [inputContent, setInputContent] = useState("");
    const [formError, setFormError] = useState("");
    const [canReload, setCanReload] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const router = useRouter();
    const inputStyle = "border-b border-b-neutral-400 focus:border-b-white outline-none placeholder-neutral-400 px-2 py-1 text-white";
  
    useEffect(() => {
        (async () => {
            const data = props.toEdit;
            if (data) {
                setInputTitle(data.title);
                setInputPostDate(dateFormat(data.postdate));
                setInputSummary(data.summary);
                setInputContent(data.content!.replaceAll("            ", ""));

                try {
                    const babelCode = babel.transform(addCodeFrame(data.content!.replaceAll("            ", "")), {presets: ["react", "es2017"]}).code as string;
                    const func = new Function("React", `return ${babelCode}`);
                    setBlog(func(React)(Image))
                } catch (e: any) {
                    let message = e.message as string;

                    setBlogError(message);
                }
                setLoading(false);
            } else {
                setInputTitle(blogDefault.title);
                setInputPostDate(dateFormat(new Date()));
                setInputSummary(blogDefault.summary);
                setInputContent(blogDefault.content);

                try {
                    const babelCode = babel.transform(addCodeFrame(blogDefault.content.replaceAll("            ", "")), {presets: ["react", "es2017"]}).code as string;
                    const func = new Function("React", `return ${babelCode}`);
                    setBlog(func(React)(Image))
                } catch (e: any) {
                    let message = e.message as string;

                    setBlogError(message);
                }
                setLoading(false);
            }
        })();
    }, [props.toEdit])
  
    function reloadBlog() {
        setBlogError("");
        try {
            const babelCode = babel.transform(addCodeFrame(inputContent), {presets: ["react", "es2017"]}).code as string;
            const func = new Function("React", `return ${babelCode}`);
            setBlog(func(React)(Image))
        } catch (e: any) {
            let message = e.message as string;

            setBlogError(message);
        }
        setLoading(false);
    }
  
    function dateFormat(date: Date) {
        return date.toLocaleString('en-US', { timeZone: 'America/New_York' });
    }
  
    function handleReload() {
        if (canReload) {
            reloadBlog();
            setCanReload(false);
            setTimeout(() => setCanReload(true), 3000);
        }
    }
  
    async function handleUpdate() {
        if (inputTitle.length == 0 || inputPostDate.length == 0 || inputSummary.length == 0 || inputContent.length == 0) {
            setFormError("No field can be empty.");
            return;
        }
        setFormError("");
  
        const newBlog: BlogType = {
            title: inputTitle,
            postdate: new Date(Date.parse(inputPostDate)),
            summary: inputSummary,
            content: inputContent
        };
  
        if (props.toEdit) {
            const res = await updateBlog(props.toEdit.title, newBlog);
            if (!res.error && confirm("Visit the updated blog?")) {
                router.push(`/blogs/${inputTitle.replaceAll(" ", "+")}`);
            }
        } else {
            const res = await createBlog(newBlog);
            if (!res.error && confirm("Visit the created blog?")) {
                router.push(`/blogs/${inputTitle.replaceAll(" ", "+")}`);
            }
        }
    }
  
    function downloadBlog(){
        if (inputTitle.length == 0 || inputPostDate.length == 0 || inputSummary.length == 0 || inputContent.length == 0) {
            setFormError("No field can be empty.");
            return;
        }
        setFormError("");

        const newBlog: BlogType = {
            title: inputTitle,
            postdate: new Date(Date.parse(inputPostDate)),
            summary: inputSummary,
            content: inputContent
        };

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newBlog, null, 4));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", inputTitle ? inputTitle.replaceAll(" ", "+") + ".json" : "new+blog.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
  
    async function openBlog(file: File) {
        const data = JSON.parse(await file.text()) as {
            title: string,
            postdate: string,
            summary: string,
            content: string,
        };
        setInputTitle(data.title);
        setInputPostDate(dateFormat(new Date(data.postdate)));
        setInputSummary(data.summary);
        setInputContent(data.content.replaceAll("            ", ""));

        try {
            const babelCode = babel.transform(addCodeFrame(data.content.replaceAll("            ", "")), {presets: ["react", "es2017"]}).code as string;
            const func = new Function("React", `return ${babelCode}`);
            setBlog(func(React)(Image))
        } catch (e: any) {
            let message = e.message as string;
    
            setBlogError(message);
        }
        setLoading(false);
    }
  
      return (
        <div className='flex'>
            <div className='pt-[90px] w-[50%] h-screen bg-neutral-900 text-white p-10'>
                {/* Title */}
                <div className='w-full mt-5'>
                    <input
                        value={inputTitle}
                        onChange={e => setInputTitle(e.target.value)}
                        type="text"
                        name="title"
                        id="title"
                        className={inputStyle + " text-2xl w-full"}
                        placeholder="Project title"
                    />
                </div>

                {/* PostDate */}
                <div className='w-full mt-5'>
                    <input
                        value={inputPostDate}
                        onChange={e => setInputPostDate(e.target.value)}
                        type="text"
                        name="postDate"
                        id="postDate"
                        className={inputStyle}
                        placeholder="Display date posted"
                    />
                </div>

                {/* Summary */}
                <div className='w-full mt-5'>
                    <textarea
                        value={inputSummary}
                        onChange={e => setInputSummary(e.target.value)}
                        name="summary"
                        id="summary"
                        className="outline-none rounded-lg placeholder-neutral-400 px-2 py-1 text-white w-full resize-none bg-neutral-950"
                        placeholder="Enter a project summary"
                    />
                </div>

                {/* Content */}
                <div className='w-full mt-5 h-[50%]'>
                    <ReactCodeMirror
                        value={inputContent}
                        height="400px"
                        extensions={[
                            langs.html(),
                            EditorView.lineWrapping
                        ]}
                        onChange={setInputContent}
                        theme={myTheme}
                        basicSetup={{
                            tabSize: 4,
                        }}
                    />
                </div>

                {formError && <p className='text-red-600 text-center mt-5'>{formError}</p>}

                {/* Submit button */}
                <div className='w-full flex justify-center mt-5 gap-5'>
                    <button
                        onClick={() => handleUpdate()}
                        className={
                            props.toEdit ?
                            'px-2 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg' :
                            'px-2 py-3 bg-green-600 hover:bg-green-700 rounded-lg'
                        }
                    >
                        {props.toEdit ? "Update" : "Create"}
                    </button>

                    <button
                        onClick={() => handleReload()}
                        className={'px-2 py-3 bg-cyan-600 rounded-lg ' + (canReload ? "hover:bg-cyan-700" : "opacity-70")}
                    >
                        Reload
                    </button>

                    <button
                        onClick={() => downloadBlog()}
                        className='px-2 py-3 bg-yellow-600 rounded-lg hover:bg-yellow-700'
                    >
                        Export
                    </button>

                    <button
                        onClick={() => setOpenModal(true)}
                        className='px-2 py-3 bg-orange-600 rounded-lg hover:bg-orange-700'
                    >
                        Open
                    </button>
                </div>
            </div>

            <div className='w-[50%] flex justify-center overflow-y-auto'>
                {loading ? <>
                    {/* If is loading */}
                    <div className="w-full h-screen flex justify-center items-center">
                        <div className="animate-spin">
                            <Image
                                width={80}
                                height={80}
                                alt="preparing QR code..."
                                src="/svgs/loading.svg"
                                priority
                            />
                        </div>
                    </div>
                </> : <>
                    {blogError ? <>
                        {/* If errored */}
                        <div className="w-full h-screen flex flex-col gap-10 justify-center items-center text-white">
                            <div className="bg-black p-5 rounded-2xl w-[90%]">
                                <p className="md:text-[30px] text-[20px] text-center mb-5">Rendering Error</p>
                                <hr className="border border-neutral-400"/>
                                <div className="overflow-x-auto w-full p-5 rounded-2xl">
                                    <div className="whitespace-pre-wrap font-mono text-[14px] w-max">
                                        {blogError}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </> : <>
                        {/* If valid code */}
                        <div className='pt-[50px] flex justify-center items-center'>
                            <div className='w-[90%] h-fit pb-10 overflow-y-auto max-h-[90vh] px-5'>
                                {blogCode}
                            </div>
                        </div>
                    </>}
                </>}
  
                  <BlogReaderModal
                      visible={openModal}
                      setVisible={setOpenModal}
                      handleOpen={openBlog}
                  />
            </div>
        </div>
    );
}
