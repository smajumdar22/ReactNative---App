import React from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, AsyncStorage,
}
  from 'react-native';
import Config from './Config';
import Header from './Header';
import Footer from './Footer';
import Note from './Note';


export default class MainStorage extends React.Component {

   
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            note: ''
        }

    }

   
    async componentDidMount() {

        const notes = await AsyncStorage.getItem('notes');
        if (notes && notes.length > 0) {
            this.setState({
                notes: JSON.parse(notes)
            })
        }

    }

  
    updateStorage(notes) {

        return new Promise( async(resolve, reject) => {

            try {

                await AsyncStorage.removeItem('notes');
                await AsyncStorage.setItem('notes', JSON.stringify(notes));
                return resolve(true);

            } catch(e) {
                return reject(e);
            }

        });

    }

    
    cloneHandler() {
        return [...this.state.notes];
    }

   
    async addNote() {

        if (this.state.note.length <= 0)
            return;

        try {

            const notes = this.cloneHandler();
            notes.push(this.state.note);

            await this.updateStorage(notes);

            this.setState({
                notes: notes,
                note: ''
            });

        }

        catch(e) {

            alert(e);

        }

    }

    async removeNote(key) {

        try {

            const notes = this.cloneHandler();
            notes.splice(key, 1);

            await this.updateStorage(notes);
            this.setState({ notes: notes });

        }

        catch(e) {

            alert(e);

        }

    }


    renderNotes() {

        return this.state.notes.map((note, i) => {
            return (
                <TouchableOpacity 
                    key={i} style={styles.note} 
                    onPress={ () => this.removeNote(i) }
                >
                    <Text style={styles.noteText}>{note}</Text>
                </TouchableOpacity>
            );
        });

    }

    render() {

        let notes = this.state.notes.map((val, key) => {
            return <Note key={key} keyval={key} val={val}
              deleteMethod={() => this.removeNote(key)} />
      
          });

        return (
            <View style={styles.container}>

                <Header title={Config.title} />

                <ScrollView style={styles.scrollView}>
                    {this.renderNotes()}
                </ScrollView>
                <Footer
                    onChangeText={ (note) => this.setState({note})  }
                    inputValue={this.state.note}
                    onNoteAdd={ () => this.addNote() }
                />

            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    scrollView: {
        maxHeight: '82%',
        marginBottom: 100,
        backgroundColor: '#fff'
    },
    note: {
        margin: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        borderRadius: 10,
    },
    noteText: {
        fontSize: 14,
        padding: 20,
    }
});