import { FileView, MarkdownView, Plugin } from "obsidian";
import { paintBgArea } from "src/services/paintImage";

export default class makeBGimageMd extends Plugin{
	
	onload(){	
		this.app.workspace.onLayoutReady(()=>{
			this.makeIterationLeaf();
		});

		this.app.workspace.on('active-leaf-change', async (leaf) => {	
			if(leaf){
				const currentLeaf = leaf.view as MarkdownView;
				paintBgArea(currentLeaf);
			}
		});

		this.app.workspace.on('editor-change', (_editor,info) => {
			const leaf = info as MarkdownView;
			paintBgArea(leaf);
		});

		this.app.workspace.on('quick-preview',(_file,data)=>{
			const leaf = this.app.workspace.getLeaf()?.view ?? null;
			if(leaf!==null){
				paintBgArea(leaf as MarkdownView,data);
			}
		});

	}

	private async makeIterationLeaf(){
		this.app.workspace.iterateRootLeaves( item => {
			const element = item.view as MarkdownView;
			if(element){
				paintBgArea(element);
			}
		});
	}

}