"use client";

import "./tiptap.styles.css";

import {
  type JSONContent,
  useEditor,
  EditorContent,
  BubbleMenu,
} from "@tiptap/react";
import clsx from "clsx";

import TableEx from "@tiptap/extension-table";
import TableCellEx from "@tiptap/extension-table-cell";
import TableHeaderEx from "@tiptap/extension-table-header";
import TableRowEx from "@tiptap/extension-table-row";
import TaskItemEx from "@tiptap/extension-task-item";
import TaskListEx from "@tiptap/extension-task-list";
import UnderlineEx from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

import { Button } from "../ui/button";
import {
  BoldIcon,
  Code2Icon,
  ItalicIcon,
  QuoteIcon,
  StrikethroughIcon,
  UnderlineIcon,
  ListEndIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListOrderedIcon,
  TableIcon,
  ListChecksIcon,
} from "lucide-react";
import React from "react";

const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
      HTMLAttributes: {
        class: "tiptap-editor__heading__1",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: "tiptap-editor__codeblock",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "tiptap-editor__list__ordered",
      },
    },
  }),
  TableEx.configure({
    resizable: true,
    cellMinWidth: 50,
    HTMLAttributes: {
      class: "tiptap-editor__table",
    },
  }),
  UnderlineEx,
  TableCellEx,
  TableHeaderEx,
  TableRowEx,
  TaskItemEx,
  TaskListEx.configure({
    HTMLAttributes: {
      class: "tiptap-editor__taskList",
    },
  }),
];

export type EditorContent = {
  editorType: "TIPTAP";
  content: JSONContent;
};

type Props = {
  data?: EditorContent;
  immediatelyRender?: boolean;
  readOnly?: boolean;
};

export type TiptapEditorForwardedRefProps = {
  getEditorData: () => EditorContent | undefined;
};

const DEFAULT_CONTENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        level: 1,
      },
      content: [
        {
          type: "text",
          text: "Your project starts here 🌎️",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Write down everything about your project and track it's success!",
        },
      ],
    },
    {
      type: "paragraph",
    },
    {
      type: "heading",
      attrs: {
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Idea",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "An idea is the starting point for all projects, big or small, what is your project's idea?",
        },
      ],
    },
    {
      type: "paragraph",
    },
    {
      type: "heading",
      attrs: {
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Functional requirements",
        },
      ],
    },
    {
      type: "table",
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableHeader",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Tag",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableHeader",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Name",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableHeader",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Description",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableHeader",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Importance",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "F01",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Lading page",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "The application should have an attractive landing page",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "2",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "F02",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Login",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "As a user I want to login in via Gmail",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "2",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "...",
                    },
                  ],
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                },
              ],
            },
            {
              type: "tableCell",
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: "paragraph",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const TiptapEditor = React.forwardRef<TiptapEditorForwardedRefProps, Props>(
  ({ data, immediatelyRender = true, readOnly = false }, ref) => {
    const editor = useEditor({
      immediatelyRender: immediatelyRender,
      extensions: extensions,
      content: data?.content ? data.content : DEFAULT_CONTENT,
    });

    React.useImperativeHandle(ref, () => ({
      getEditorData() {
        if (!editor) return;

        const jsonData: EditorContent = {
          editorType: "TIPTAP",
          content: editor.getJSON(),
        };

        return jsonData;
      },
    }));

    return (
      <div className="relative max-h-[600px] min-h-[400px] w-full overflow-y-auto overflow-x-hidden rounded-sm border border-gray-200">
        {/** TOOLBAR */}
        <div className="sticky top-0 z-20 flex w-full flex-row flex-wrap divide-x-0 divide-solid border-gray-400 bg-gray-100">
          <Button
            variant={"ghost"}
            className={clsx(
              "p-3 hover:bg-indigo-200",
              editor?.isActive("bold") && "bg-indigo-300",
            )}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <BoldIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            className={clsx(
              "p-3 hover:bg-indigo-200",
              editor?.isActive("italic") && "bg-indigo-300",
            )}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <ItalicIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            className={clsx(
              "p-3 hover:bg-indigo-200",
              editor?.isActive("strike") && "bg-indigo-300",
            )}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <StrikethroughIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            className={clsx(
              "p-3 hover:bg-indigo-200",
              editor?.isActive("underline") && "bg-indigo-300",
            )}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            className={clsx(
              "p-3 hover:bg-indigo-200",
              editor?.isActive("blockquote") && "bg-indigo-300",
            )}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            <QuoteIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            className={clsx(
              "p-3 hover:bg-indigo-200",
              editor?.isActive("codeBlock") && "bg-indigo-300",
            )}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          >
            <Code2Icon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            className={clsx(
              "p-3 hover:bg-indigo-200",
              editor?.isActive("hardbreak") && "bg-indigo-300",
            )}
            onClick={() => editor?.chain().focus().setHardBreak().run()}
          >
            <ListEndIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            className={clsx(
              "p-3 hover:bg-indigo-200",
              editor?.isActive("heading", { level: 1 }) && "bg-indigo-300",
            )}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1Icon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            className={clsx(
              "p-3 hover:bg-indigo-200",
              editor?.isActive("heading", { level: 2 }) && "bg-indigo-300",
            )}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2Icon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            className={clsx(
              "p-3 hover:bg-indigo-200",
              editor?.isActive("heading", { level: 3 }) && "bg-indigo-300",
            )}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3Icon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            className={clsx(
              "p-3 hover:bg-indigo-200",
              editor?.isActive("orderedList") && "bg-indigo-300",
            )}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrderedIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            className={"p-3 hover:bg-indigo-200"}
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            className={clsx(
              "p-3 hover:bg-indigo-200",
              editor?.isActive("taskList") && "bg-indigo-300",
            )}
            onClick={() => editor?.chain().focus().toggleTaskList().run()}
          >
            <ListChecksIcon className="h-4 w-4" />
          </Button>
        </div>

        {editor && (
          <BubbleMenu
            editor={editor}
            className="shadow--sm flex w-fit min-w-[100px] flex-row flex-wrap gap-1 rounded-sm border-2 border-gray-200 bg-gray-100 p-2"
            shouldShow={({ editor }) => {
              // only show the bubble menu for images and links
              return editor.isActive("table");
            }}
            tippyOptions={{
              duration: 100,
            }}
          >
            <Button
              variant={"ghost"}
              size={"sm"}
              className="border bg-white text-sm"
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              Add row before
            </Button>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="border bg-white text-sm"
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              Add row after
            </Button>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="border bg-white text-sm"
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              Delete row
            </Button>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="border bg-white text-sm"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              Add column before
            </Button>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="border bg-white text-sm"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              Add column after
            </Button>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="border bg-white text-sm"
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              Delete column
            </Button>
          </BubbleMenu>
        )}

        <EditorContent
          readOnly={readOnly}
          editor={editor}
          className="z-10 w-full px-3 py-4 [&>*]:min-h-[400px]"
        />
      </div>
    );
  },
);

TiptapEditor.displayName = "TiptapEditor";
export default TiptapEditor;
