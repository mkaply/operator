/*
eRDF parser

author: Keith Alexander (http://semwebdev.keithalexander.co.uk/blog/)
last-modified: 7th August 2007
license: GPL
usage:
	if(eRDF.hasRDF(document))
	{
		var parser = eRDF.parser(document);
		var triples = parser.get_triples();
		//smush
		parser.do_owlSameAs();
		var smushed_triples = parser.get_triples();
	}
*/
// setup the basic
if (typeof(eRDF) == 'undefined') {
    eRDF = new Object();
}

eRDF.reset = function() {
   // reset the triple container
   eRDF.triples = new Object();
};

eRDF.reset();

//
// dummy callbacks in case they're not defined
//
if (!eRDF.CALLBACK_DONE_LOADING) eRDF.CALLBACK_DONE_LOADING = function() {};

eRDF.hasRDF = function(document)
{
	/*
		Check to see if the eRDF or DC profiles are there, or if no profile is there (in case the author forgot to use the @profile). If so, we check if any schemas have been declared (without which there can be no RDF).
		
	*/
	
	var profile = document.getElementsByTagName('head')[0].getAttribute('profile');
	//decide whether to parse as eRDF or not	
	if(!profile || profile.match('http://purl.org/NET/erdf/profile(/)*( |$)') || profile.match('http://dublincore.org/documents/dcq-html(/)*( |$)')  )
	{
		if(!document) document = window.document;
		var links = document.getElementsByTagName('link');
		for (var i=0; i < links.length; i++) {
			if(links[i].rel.substring(0,7) == 'schema.')
			{
				return true;
			}
		};
		return false;
	}
	else
	{
		return false;
	}	
}

eRDF.parser = function(document){	
	if(!document) document = window.document;
	
	this.get_base = function(){
		var bases= document.getElementsByTagName('base');
		if(bases.length){
			var base = bases[0].getAttribute('href');
		}else{ var base = location.href}
			
			return base+"#";
	};
	this._get_triples = function(el){
		var resource = this.get_base()+this._last_el_with_id(el);
		var pred_atts = ['class','rev','rel'];
		if (el.tagName.toLowerCase() == 'meta')  pred_atts = ['name'];

		var pred_len = pred_atts.length;
		for (var i=0; i < pred_len; i++) {
			var att = pred_atts[i];
			this._get_triple(el, resource, att);
		};
		for (var i=0; i < el.childNodes.length; i++) 
		{
				if(el.childNodes[i].nodeType==1) this._get_triples(el.childNodes[i]);
		};
	};

	this._get_triple = function(el, resource, att){
	
	if(att=='class') var att_val =el.className;
	else var att_val = el.getAttribute(att);
		
			if (att_val && att_val.match(/-|\./))
			{
				var att_names = att_val.split(' ');
				var att_len = att_names.length
				for (var i=0; i < att_len; i++)
				{
					var att_name = att_names[i];
					if(att_name.match(/-|\./))
					{

						if(att=='class')
						{
							var rdftype = this.get_rdftype(att_name);	
							
							 if(rdftype)
							{
								var el_id = el.getAttribute('id');
								var el_href = el.getAttribute('href');
								if(el_id) var s = this.get_base()+el.getAttribute('id');
								else if(el_href) var s = el.href;
								if (el_id || el_href) this.triples.push({"s":s,"p": this.rdf_type,"p_label":'rdf-type', "o": rdftype,"o_label":att_name,"o_type":"uri" });
							}
						}
						else if(this.get_predicate(att_name))
						{
							var o = this.get_object(el, att)	;
							var p = this.get_predicate(att_name) ;

							// rdfs:label images
							if(el.getAttribute('src') && el.getAttribute('title')) this.triples.push({"s":el.src, "p": this.rdfs_label,"p_label":'rdfs-label', "o": el.getAttribute('title'),"o_type":"literal" });
							// rdfs:label anchors
							if(el.getAttribute('href') && (att=='rel'||att=='rev') && this.get_object(el, 'label') ) this.triples.push({"s":el.href,"p": this.rdfs_label,"p_label":'rdfs-label', "o": this.get_object(el, 'label').value, "o_type":"literal" });
							//the triple, reversed for 'rev'
							if(att!='rev') this.triples.push({"s":resource,"p": p,"p_label":att_name, "o": o.value,"o_type":o.type });
							else this.triples.push({"s":o.value,"p": p,"p_label":att_name, "o": resource, "o_type":"uri" });
						}
					}
				};
			}
	}
	

	this._last_el_with_id = function(el){

			if(el.getAttribute('id')) return el.id;
			else if(el.parentNode.nodeType==1) return this._last_el_with_id(el.parentNode);
			else return '';

	};


	this.get_object = function(el, att_type)
	{

		//welll, not always object, if @rev, s o will be reversed afterwards
		var el_title = el.getAttribute('title');
		var el_id = el.getAttribute('id');
		var el_src = el.getAttribute('src');
		if(att_type=='class')
		{
			if (el_src) return {'value': el.src, 'type':'uri'};
			else if(el_id) return {'value': this.get_base()+el.id , 'type':'uri'};
			else if(el_title) return {'value': el_title , 'type':'literal'};
			else {
				var o_value =  (document.getElementsByTagName("body")[0].innerText != undefined)? el.innerText : el.textContent;
				return {'value': o_value, 'type':'literal'};
			}
		}
		else if(att_type=='label')
		{
			if(el_title) return {'value':el_title,'type':'literal'};
			else {
					var o_value =  (document.getElementsByTagName("body")[0].innerText != undefined)? el.innerText : el.textContent;
					return {'value': o_value, 'type':'literal'};
				}
		}
		else if(att_type=='rel' || att_type=='rev')
		{
			var o_value =  el.href;
			return {'value': o_value, 'type':'uri'};
		}
		else if(att_type=='name')
		{
			return {'value': el.getAttribute('content'), 'type':'literal'};
			
		}
	}

	this.get_rdftype = function(class_att){ return this.check_type(class_att,  'rdftype'); }
	this.get_predicate = function(class_att){ return this.check_type(class_att,  "predicate"); }

	this.check_type = function(class_att, classType)
	{
		if(class_att.match('-'))
		{
			var found = false;
			for(var prefix in this.schemas)
			{
				var regex = (classType=='rdftype')? '-'+prefix+'-' : prefix+'-';
				if(class_att.match(regex))
				{

					var regex_term = prefix+'-(.+)';
					
					found =  this.schemas[prefix]+class_att.match(regex_term)[1];
				}
			};
			return found;
		}
		else return false;
	}
	
	
	this.triples = [];
	this.schemas = {};
	this.rdf_type 	= 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
	this.rdfs_label = 'http://www.w3.org/2000/01/rdf-schema#label';
	this.links = document.getElementsByTagName('link');
	for (var i=0; i < this.links.length; i++) {
		if(this.links[i].rel.substring(0,7) == 'schema.')
		{
			var schema_name = this.links[i].rel.substring(7);
			this.schemas[schema_name] = this.links[i].href;
		}
	};
	
	
	this._get_triples(document.getElementsByTagName('html')[0]);
	
	this.get_triples = function(){ return this.triples;}

	this._get_label = function(subject){
		
		for (var i=0; i < this.triples.length; i++)
		{
			var triple = this.triples[i];
			if(triple.s == subject)
			{
				if(triple.p_label.match(/(name)|(title)|(label)/i)) return triple.o; 	
			}
		}
		return subject;
	};
	
	this.do_owlSameAs= function()
	{
		var same_ids = {};
		for (var i=0; i < this.triples.length; i++) 
		{
			var t = this.triples[i];
			if (t.p == 'http://www.w3.org/2002/07/owl#sameAs')
			{
				same_ids[t.s] = t.o;
				//remove owl-sameAs triple
				this.triples.splice(i,1);
			}
		};
		
			//change all matching triples
		for (var j=0; j < this.triples.length; j++) 
		{
			var t = this.triples[j];
			if (same_ids[t.s]) 
			{
				this.triples[j].s = same_ids[t.s];
			}
			else if (same_ids[t.o]) 
				 {
					this.triples[j].o = same_ids[t.o];
				 }
		}
		
		return this.triples;
	}
	
	return this;
};
		
eRDF.CALLBACK_DONE_LOADING();
